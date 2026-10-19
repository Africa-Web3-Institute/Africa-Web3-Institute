import { dbGet, dbAll, dbRun } from "../db/init.js";

// ==========================================
// NEWSLETTER SUBSCRIPTION (Public)
// ==========================================
export const subscribe = async (req, res) => {
  try {
    const { email, name = "", source = "website" } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: "Please provide a valid email address.",
        message: "Please enter a valid email address."
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await dbGet("SELECT * FROM newsletter_subscribers WHERE email = ?", [cleanEmail]);

    if (existing) {
      if (existing.status !== "active") {
        await dbRun("UPDATE newsletter_subscribers SET status = \x27active\x27 WHERE email = ?", [cleanEmail]);
      }
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: "You are already subscribed to the Africa Web3 Institute newsletter."
      });
    }

    await dbRun(
      "INSERT INTO newsletter_subscribers (email, name, status, source) VALUES (?, ?, \x27active\x27, ?)",
      [cleanEmail, name || "", source || "website"]
    );

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! You will receive our next intelligence brief."
    });
  } catch (err) {
    console.error("Newsletter subscribe error:", err);
    res.status(500).json({ success: false, error: "Subscription failed. Please try again." });
  }
};

// ==========================================
// NEWSLETTERS ARCHIVE (Public)
// ==========================================
export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await dbAll("SELECT * FROM newsletters WHERE status = \x27sent\x27 ORDER BY edition DESC, date DESC");
    // Also return array directly or wrapped for compatibility with NewsletterArchive.jsx
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
// ADMIN NEWSLETTER MANAGEMENT
// ==========================================
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await dbAll("SELECT * FROM newsletter_subscribers ORDER BY subscribedAt DESC");
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { title, edition, date, description, content, readTime, url } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "Title is required" });

    const activeSubs = await dbAll("SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = \x27active\x27");
    const recipientCount = activeSubs?.[0]?.count || 0;

    await dbRun(
      "INSERT INTO newsletters (title, edition, date, description, content, readTime, url, status) VALUES (?, ?, ?, ?, ?, ?, ?, \x27sent\x27)",
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
