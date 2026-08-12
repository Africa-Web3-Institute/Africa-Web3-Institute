import { dbGet, dbAll, dbRun } from '../db/init.js';

// 1x1 transparent PNG pixel Buffer
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

// ---- Subscribers & Segmentation ----
export const getSubscribers = async (req, res) => {
  const { segment, status } = req.query;

  try {
    let query = 'SELECT * FROM subscribers';
    const params = [];
    const conditions = [];

    if (segment && segment !== 'all') {
      conditions.push('segment = ?');
      params.push(segment);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY subscribedAt DESC';

    const subscribers = await dbAll(query, params);
    res.status(200).json({ data: subscribers, count: subscribers.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addSubscriber = async (req, res) => {
  const { email, name, segment } = req.body;

  if (!email) return res.status(400).json({ error: 'Email address is required.' });

  try {
    const existing = await dbGet('SELECT * FROM subscribers WHERE email = ?', [email.trim()]);
    if (existing) {
      // Update segment/name if already subscribed
      await dbRun(
        'UPDATE subscribers SET name = ?, segment = ?, status = "active" WHERE id = ?',
        [name || existing.name, segment || existing.segment, existing.id]
      );
      return res.status(200).json({ success: true, message: 'Subscriber preference updated', subscriberId: existing.id });
    }

    await dbRun(
      'INSERT INTO subscribers (email, name, segment) VALUES (?, ?, ?)',
      [email.trim(), name || '', segment || 'general']
    );

    const newSub = await dbGet('SELECT * FROM subscribers WHERE email = ?', [email.trim()]);
    res.status(201).json({ success: true, message: 'Subscribed successfully', subscriberId: newSub ? newSub.id : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Campaigns ----
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await dbAll('SELECT * FROM newsletter_campaigns ORDER BY createdAt DESC');
    res.status(200).json({ data: campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCampaign = async (req, res) => {
  const { title, subject, segment } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ error: 'Title and subject are required.' });
  }

  try {
    // Count eligible subscribers in target segment
    let countRow;
    if (!segment || segment === 'all') {
      countRow = await dbGet("SELECT COUNT(*) as count FROM subscribers WHERE status = 'active'");
    } else {
      countRow = await dbGet("SELECT COUNT(*) as count FROM subscribers WHERE status = 'active' AND segment = ?", [segment]);
    }

    const totalSent = countRow ? countRow.count : 0;
    const nowStr = new Date().toISOString();

    await dbRun(
      'INSERT INTO newsletter_campaigns (title, subject, segment, sentAt, totalSent, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subject, segment || 'all', nowStr, totalSent, 'sent']
    );

    res.status(201).json({ success: true, message: 'Newsletter campaign dispatched', totalSent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Open Tracking Pixel ----
export const trackOpen = async (req, res) => {
  const { campaignId, subscriberId } = req.params;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  try {
    const campaignIdInt = parseInt(campaignId, 10);
    const subscriberIdInt = parseInt(subscriberId, 10);

    if (!isNaN(campaignIdInt) && !isNaN(subscriberIdInt)) {
      // Record open event log
      await dbRun(
        'INSERT INTO newsletter_opens (campaignId, subscriberId, userAgent, ip) VALUES (?, ?, ?, ?)',
        [campaignIdInt, subscriberIdInt, userAgent, typeof ip === 'string' ? ip : '127.0.0.1']
      );

      // Increment campaign open count
      await dbRun(
        'UPDATE newsletter_campaigns SET opens = opens + 1 WHERE id = ?',
        [campaignIdInt]
      );

      // Update subscriber engagement
      await dbRun(
        'UPDATE subscribers SET lastEngagedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [subscriberIdInt]
      );
    }
  } catch (err) {
    console.error('Newsletter open tracking failed silently:', err.message);
  }

  // Always return 1x1 transparent PNG
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': TRANSPARENT_PNG.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(TRANSPARENT_PNG);
};

// ---- Click Redirect Tracking ----
export const trackClick = async (req, res) => {
  const { campaignId, subscriberId } = req.params;
  const targetUrl = req.query.url || req.query.target || 'https://africaweb3institute.org';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  try {
    const campaignIdInt = parseInt(campaignId, 10);
    const subscriberIdInt = parseInt(subscriberId, 10);

    if (!isNaN(campaignIdInt) && !isNaN(subscriberIdInt)) {
      // Record click event log
      await dbRun(
        'INSERT INTO newsletter_clicks (campaignId, subscriberId, targetUrl, userAgent, ip) VALUES (?, ?, ?, ?, ?)',
        [campaignIdInt, subscriberIdInt, targetUrl, userAgent, typeof ip === 'string' ? ip : '127.0.0.1']
      );

      // Increment campaign click count
      await dbRun(
        'UPDATE newsletter_campaigns SET clicks = clicks + 1 WHERE id = ?',
        [campaignIdInt]
      );

      // Update subscriber engagement
      await dbRun(
        'UPDATE subscribers SET lastEngagedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [subscriberIdInt]
      );
    }
  } catch (err) {
    console.error('Newsletter click tracking failed silently:', err.message);
  }

  // Execute standard HTTP 302 redirect to target URL
  res.redirect(302, targetUrl);
};

// ---- Newsletter Intelligence & Analytics Report ----
export const getNewsletterAnalytics = async (req, res) => {
  try {
    const totalSubsRow = await dbGet('SELECT COUNT(*) as count FROM subscribers WHERE status = "active"');
    const segmentRows = await dbAll('SELECT segment, COUNT(*) as count FROM subscribers GROUP BY segment');
    const campaigns = await dbAll('SELECT * FROM newsletter_campaigns');

    let totalSent = 0;
    let totalOpens = 0;
    let totalClicks = 0;

    campaigns.forEach(c => {
      totalSent += c.totalSent || 0;
      totalOpens += c.opens || 0;
      totalClicks += c.clicks || 0;
    });

    const openRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : 0;
    const ctrRate = totalOpens > 0 ? ((totalClicks / totalOpens) * 100).toFixed(1) : 0;

    const segmentBreakdown = {};
    segmentRows.forEach(r => { segmentBreakdown[r.segment] = r.count; });

    res.status(200).json({
      report: {
        totalSubscribers: totalSubsRow ? totalSubsRow.count : 0,
        segmentBreakdown,
        totalCampaignsSent: campaigns.length,
        totalEmailsSent: totalSent,
        totalOpens,
        totalClicks,
        averageOpenRatePercent: parseFloat(openRate),
        clickThroughRatePercent: parseFloat(ctrRate),
        trackingActive: true
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
