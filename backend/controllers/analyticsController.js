import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import { dbGet, dbAll, dbRun } from '../db/init.js';

// List of African countries for realistic local simulation
const AFRICAN_COUNTRIES = [
  { code: 'NG', name: 'Nigeria' }, { code: 'ZA', name: 'South Africa' },
  { code: 'KE', name: 'Kenya' }, { code: 'SN', name: 'Senegal' },
  { code: 'EG', name: 'Egypt' }, { code: 'GH', name: 'Ghana' },
  { code: 'MA', name: 'Morocco' }, { code: 'RW', name: 'Rwanda' },
  { code: 'ET', name: 'Ethiopia' }, { code: 'CI', name: 'Ivory Coast' }
];

// Global Diagnostics Cache
const diagnostics = {
  bytesIngested: 0,
  eventsProcessed: 0,
  processingTimeSumMs: 0
};

export let sseConnections = [];

// Broadcasting SSE Utility
export const broadcast = (type, data) => {
  const payload = JSON.stringify({ type, data });
  sseConnections.forEach(res => {
    res.write(`data: ${payload}\n\n`);
  });
};

export const broadcastMetrics = async () => {
  const stats = await computeAggregatedStats();
  if (stats) broadcast('metrics', stats);
};

export const computeAggregatedStats = async () => {
  const now = new Date();
  const activeThreshold = new Date(now.getTime() - 30 * 1000).toISOString();

  try {
    const activeUsersRow = await dbGet("SELECT COUNT(DISTINCT sessionId) as count FROM sessions WHERE lastHeartbeat >= ?", [activeThreshold]);
    const countersRow = await dbGet(`
      SELECT 
        COUNT(*) as totalPageViews,
        (SELECT COUNT(DISTINCT sessionId) FROM sessions) as totalSessions,
        (SELECT SUM(duration) FROM sessions) as totalDuration
      FROM events WHERE eventName = 'pageview'
    `);
    const bounceRow = await dbGet("SELECT COUNT(*) as count FROM sessions WHERE pageviews = 1 AND lastHeartbeat < ?", [activeThreshold]);

    const pageviewsRows = await dbAll("SELECT path, COUNT(*) as count FROM events WHERE eventName = 'pageview' GROUP BY path ORDER BY count DESC");
    const pageViewsObj = {}; pageviewsRows.forEach(r => pageViewsObj[r.path] = r.count);

    const referrerRows = await dbAll("SELECT referrer, COUNT(*) as count FROM sessions GROUP BY referrer ORDER BY count DESC");
    const referrersObj = {}; referrerRows.forEach(r => referrersObj[r.referrer] = r.count);

    const browserRows = await dbAll("SELECT browser, COUNT(*) as count FROM sessions GROUP BY browser ORDER BY count DESC");
    const browsersObj = {}; browserRows.forEach(r => browsersObj[r.browser] = r.count);

    const osRows = await dbAll("SELECT os, COUNT(*) as count FROM sessions GROUP BY os ORDER BY count DESC");
    const osObj = {}; osRows.forEach(r => osObj[r.os] = r.count);

    const countryRows = await dbAll("SELECT country, COUNT(*) as count FROM sessions GROUP BY country ORDER BY count DESC");
    const countriesObj = {}; countryRows.forEach(r => countriesObj[r.country] = r.count);

    const hourlyRows = await dbAll("SELECT strftime('%H', timestamp) as hr, COUNT(*) as count FROM events WHERE eventName = 'pageview' GROUP BY hr ORDER BY hr ASC");
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const targetHour = (now.getHours() - (23 - i) + 24) % 24;
      const targetHourStr = targetHour.toString().padStart(2, '0');
      const match = hourlyRows.find(h => h.hr === targetHourStr);
      return { hour: targetHour, count: match ? match.count : 0 };
    });

    const totalSessions = countersRow.totalSessions || 0;
    const avgDuration = totalSessions > 0 ? Math.round((countersRow.totalDuration || 0) / totalSessions) : 0;
    const bounceRate = totalSessions > 0 ? Math.round((bounceRow.count / totalSessions) * 100) : 0;

    return {
      activeUsers: activeUsersRow.count,
      totalPageViews: countersRow.totalPageViews || 0,
      totalSessions,
      avgSessionDuration: avgDuration,
      bounceRate: Math.min(100, Math.max(0, bounceRate)),
      pageViews: pageViewsObj,
      referrers: referrersObj,
      browsers: browsersObj,
      os: osObj,
      countries: countriesObj,
      hourlyStats,
      diagnostics: {
        ...diagnostics,
        avgProcessingTimeMs: diagnostics.eventsProcessed > 0
          ? (diagnostics.processingTimeSumMs / diagnostics.eventsProcessed).toFixed(3)
          : 0
      }
    };
  } catch (err) {
    console.error("SQL aggregate computation failed:", err);
    return null;
  }
};

export const processIncomingTelemetry = async (rawEvent, ip, userAgentHeader) => {
  const startTime = process.hrtime();
  const payloadSize = Buffer.byteLength(JSON.stringify(rawEvent));
  
  diagnostics.bytesIngested += payloadSize;
  diagnostics.eventsProcessed += 1;

  const { sessionId, eventName, path, referrer, eventData, simulatedGeo, simulatedAgent } = rawEvent;
  if (!sessionId) return null;

  let browser, os, geo;

  if (simulatedAgent) {
    browser = simulatedAgent.browser || 'Chrome';
    os = simulatedAgent.os || 'Android';
  } else {
    const parser = new UAParser(userAgentHeader);
    const agent = parser.getResult();
    browser = agent.browser.name || 'Unknown';
    os = agent.os.name || 'Unknown';
  }

  if (simulatedGeo) {
    geo = AFRICAN_COUNTRIES.find(c => c.code === simulatedGeo) || AFRICAN_COUNTRIES[0];
  } else {
    const geoData = geoip.lookup(ip);
    if (geoData && geoData.country) {
      try {
        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
        geo = { name: regionNames.of(geoData.country) || geoData.country, code: geoData.country };
      } catch (e) {
        geo = { name: geoData.country, code: geoData.country };
      }
    } else {
      geo = { name: 'Unknown', code: 'UN' };
    }
  }

  const now = new Date();
  const nowStr = now.toISOString();

  try {
    const existingSession = await dbGet("SELECT * FROM sessions WHERE sessionId = ?", [sessionId]);

    if (!existingSession) {
      await dbRun(
        "INSERT INTO sessions (sessionId, startedAt, lastHeartbeat, duration, pageviews, browser, os, country, countryCode, referrer, currentPage) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?)",
        [sessionId, nowStr, nowStr, eventName === 'pageview' ? 1 : 0, browser, os, geo.name, geo.code, referrer || 'Direct', path || '/']
      );
    } else {
      const updatedPageviews = existingSession.pageviews + (eventName === 'pageview' ? 1 : 0);
      const newDuration = Math.round((now - new Date(existingSession.startedAt)) / 1000);
      await dbRun(
        "UPDATE sessions SET lastHeartbeat = ?, duration = ?, pageviews = ?, currentPage = ? WHERE sessionId = ?",
        [nowStr, newDuration, updatedPageviews, path || existingSession.currentPage, sessionId]
      );
    }

    const eventId = Math.random().toString(36).substring(2, 9);
    await dbRun(
      "INSERT INTO events (id, sessionId, timestamp, eventName, path, country, browser, os, eventData) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [eventId, sessionId, nowStr, eventName, path || '/', geo.name, browser, os, eventData ? JSON.stringify(eventData) : null]
    );

    const processedEvent = {
      id: eventId, timestamp: nowStr, sessionId, eventName, path: path || '/',
      country: geo.name, countryCode: geo.code, browser, os, eventData: eventData || null
    };

    const diff = process.hrtime(startTime);
    diagnostics.processingTimeSumMs += (diff[0] * 1e9 + diff[1]) / 1e6;

    return processedEvent;
  } catch (err) {
    console.error("Database ingestion failed:", err);
    return null;
  }
};
