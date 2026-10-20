import { dbGet, dbAll, dbRun } from '../db/init.js';

// 1x1 transparent PNG pixel Buffer
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

// ==========================================
// NEWSLETTER SUBSCRIPTION (Public)
// ==========================================
export const subscribe = async (req, res) => {
  try {
    const { email, name = "", source = "website", segment = "general" } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "Please provide a valid email address.",
        message: "Please enter a valid email address."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check newsletter_subscribers
    const existing = await dbGet("SELECT * FROM newsletter_subscribers WHERE email = ?", [cleanEmail]);
    if (existing) {
      if (existing.status !== "active") {
        await dbRun("UPDATE newsletter_subscribers SET status = 'active' WHERE email = ?", [cleanEmail]);
      }
    } else {
      await dbRun(
        "INSERT INTO newsletter_subscribers (email, name, status, source) VALUES (?, ?, 'active', ?)",
        [cleanEmail, name || "", source || "website"]
      );
    }

    // Also mirror to subscribers table for campaign intelligence
    const existingSub = await dbGet("SELECT * FROM subscribers WHERE email = ?", [cleanEmail]);
    if (existingSub) {
      await dbRun("UPDATE subscribers SET name = ?, status = 'active' WHERE id = ?", [name || existingSub.name, existingSub.id]);
    } else {
      await dbRun(
        "INSERT INTO subscribers (email, name, segment, status) VALUES (?, ?, ?, 'active')",
        [cleanEmail, name || "", segment || "general"]
      );
    }

    if (existing) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: "You are already subscribed to the Africa Web3 Institute newsletter."
      });
    }

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! You will receive our next intelligence brief."
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ success: false, error: "Subscription failed. Please try again." });
  }
};

export const addSubscriber = async (req, res) => {
  const { email, name, segment } = req.body;

  if (!email) return res.status(400).json({ error: 'Email address is required.' });

  try {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await dbGet('SELECT * FROM subscribers WHERE email = ?', [cleanEmail]);
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
      [cleanEmail, name || '', segment || 'general']
    );

    // Also mirror to newsletter_subscribers
    const existingNl = await dbGet('SELECT * FROM newsletter_subscribers WHERE email = ?', [cleanEmail]);
    if (!existingNl) {
      await dbRun(
        "INSERT INTO newsletter_subscribers (email, name, status, source) VALUES (?, ?, 'active', 'campaign')",
        [cleanEmail, name || '']
      );
    }

    const newSub = await dbGet('SELECT * FROM subscribers WHERE email = ?', [cleanEmail]);
    res.status(201).json({ success: true, message: 'Subscribed successfully', subscriberId: newSub ? newSub.id : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// NEWSLETTERS ARCHIVE (Public)
// ==========================================
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await dbAll("SELECT * FROM newsletters WHERE status = 'sent' ORDER BY edition DESC, date DESC");
    res.status(200).json(newsletters);
  } catch (err) {
    console.error("Error fetching newsletters:", err);
    res.status(500).json({ error: "Failed to retrieve newsletters" });
  }
};

export const getNewsletterById = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await dbGet("SELECT * FROM newsletters WHERE id = ?", [id]);
    if (!newsletter) return res.status(404).json({ error: "Newsletter not found" });
    res.status(200).json(newsletter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// SUBSCRIBERS (Admin)
// ==========================================
export const getSubscribers = async (req, res) => {
  const { segment, status } = req.query || {};

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

    let subscribers = await dbAll(query, params);

    // If subscribers table is empty, fall back to newsletter_subscribers
    if (!subscribers || subscribers.length === 0) {
      subscribers = await dbAll('SELECT * FROM newsletter_subscribers ORDER BY subscribedAt DESC');
    }

    res.status(200).json({ success: true, data: subscribers, count: subscribers.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { title, edition, date, description, content, readTime, url } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "Title is required" });

    const activeSubs = await dbAll("SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'");
    const recipientCount = activeSubs?.[0]?.count || 0;

    await dbRun(
      "INSERT INTO newsletters (title, edition, date, description, content, readTime, url, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'sent')",
      [title, edition || null, date || new Date().toISOString().split("T")[0], description || "", content || "", readTime || "4 min read", url || "#"]
    );

    res.status(201).json({
      success: true,
      message: `Newsletter edition broadcast and archived for ${recipientCount} subscribers.`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// CAMPAIGNS & TRACKING
// ==========================================
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

// Open Tracking Pixel
export const trackOpen = async (req, res) => {
  const { campaignId, subscriberId } = req.params;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  try {
    const campaignIdInt = parseInt(campaignId, 10);
    const subscriberIdInt = parseInt(subscriberId, 10);

    if (!isNaN(campaignIdInt) && !isNaN(subscriberIdInt)) {
      await dbRun(
        'INSERT INTO newsletter_opens (campaignId, subscriberId, userAgent, ip) VALUES (?, ?, ?, ?)',
        [campaignIdInt, subscriberIdInt, userAgent, typeof ip === 'string' ? ip : '127.0.0.1']
      );

      await dbRun(
        'UPDATE newsletter_campaigns SET opens = opens + 1 WHERE id = ?',
        [campaignIdInt]
      );

      await dbRun(
        'UPDATE subscribers SET lastEngagedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [subscriberIdInt]
      );
    }
  } catch (err) {
    console.error('Newsletter open tracking failed silently:', err.message);
  }

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': TRANSPARENT_PNG.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(TRANSPARENT_PNG);
};

// Click Redirect Tracking
export const trackClick = async (req, res) => {
  const { campaignId, subscriberId } = req.params;
  const targetUrl = req.query.url || req.query.target || 'https://africaweb3institute.org';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  try {
    const campaignIdInt = parseInt(campaignId, 10);
    const subscriberIdInt = parseInt(subscriberId, 10);

    if (!isNaN(campaignIdInt) && !isNaN(subscriberIdInt)) {
      await dbRun(
        'INSERT INTO newsletter_clicks (campaignId, subscriberId, targetUrl, userAgent, ip) VALUES (?, ?, ?, ?, ?)',
        [campaignIdInt, subscriberIdInt, targetUrl, userAgent, typeof ip === 'string' ? ip : '127.0.0.1']
      );

      await dbRun(
        'UPDATE newsletter_campaigns SET clicks = clicks + 1 WHERE id = ?',
        [campaignIdInt]
      );

      await dbRun(
        'UPDATE subscribers SET lastEngagedAt = CURRENT_TIMESTAMP WHERE id = ?',
        [subscriberIdInt]
      );
    }
  } catch (err) {
    console.error('Newsletter click tracking failed silently:', err.message);
  }

  res.redirect(302, targetUrl);
};

// Newsletter Intelligence & Analytics Report
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
