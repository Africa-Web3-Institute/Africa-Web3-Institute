import express from 'express';
import { dbAll } from '../db/init.js';
import {
  processIncomingTelemetry,
  broadcast,
  broadcastMetrics,
  computeAggregatedStats,
  sseConnections
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/event', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Africa Web Institute Telemetry Ingestion API',
    timestamp: new Date().toISOString()
  });
});

router.post('/event', async (req, res) => {
  const rawEvent = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  if (!rawEvent || !rawEvent.sessionId || !rawEvent.eventName) {
    return res.status(400).json({ error: 'Invalid event payload' });
  }

  const processedEvent = await processIncomingTelemetry(rawEvent, ip, userAgent);

  if (processedEvent) {
    broadcast('event', processedEvent);
    await broadcastMetrics();
    res.status(200).json({ success: true, eventId: processedEvent.id });
  } else {
    res.status(500).json({ error: 'Failed to ingest event into database' });
  }
});

router.get('/live', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  try {
    const recentEvents = await dbAll(`
      SELECT id, sessionId, timestamp, eventName, path, country, browser, os, eventData 
      FROM events ORDER BY timestamp DESC LIMIT 30
    `);
    
    const history = recentEvents.map(e => ({
      ...e,
      eventData: e.eventData ? JSON.parse(e.eventData) : null
    }));

    const metrics = await computeAggregatedStats();
    res.write(`data: ${JSON.stringify({ type: 'init', data: { metrics, history } })}\n\n`);
  } catch (err) {
    console.error("SSE initial payload assembly failed:", err);
  }

  sseConnections.push(res);

  req.on('close', () => {
    const index = sseConnections.indexOf(res);
    if (index !== -1) sseConnections.splice(index, 1);
  });
});

router.get('/export', async (req, res) => {
  try {
    const events = await dbAll('SELECT id, sessionId, timestamp, eventName, path, country, browser, os FROM events ORDER BY timestamp DESC');
    const csvHeaders = 'id,sessionId,timestamp,eventName,path,country,browser,os\n';
    const csvRows = events.map(e => 
      `"${e.id}","${e.sessionId}","${e.timestamp}","${e.eventName}","${e.path}","${e.country}","${e.browser}","${e.os}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=telemetry_export.csv');
    res.status(200).send(csvHeaders + csvRows);
  } catch (err) {
    res.status(500).json({ error: "Failed to export CSV telemetry logs" });
  }
});

export default router;
