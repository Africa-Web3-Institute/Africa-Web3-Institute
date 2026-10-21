import { dbGet, dbAll, dbRun } from '../db/init.js';

// Public endpoint to submit contact form message
export const submitContactMessage = async (req, res) => {
  const { name, email, organization, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    await dbRun(
      'INSERT INTO contact_messages (name, email, organization, subject, message, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), organization ? organization.trim() : '', subject ? subject.trim() : 'Website Inquiry', message.trim(), 'unread']
    );

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting Africa Web3 Institute. Your message has been received.'
    });
  } catch (err) {
    console.error('Failed to save contact message:', err);
    res.status(500).json({ error: 'An error occurred while saving your message.' });
  }
};

// Admin endpoint to list received contact messages
export const getContactMessages = async (req, res) => {
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC';

    const messages = await dbAll(query, params);
    const unreadRow = await dbGet("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'");

    res.status(200).json({
      data: messages,
      count: messages.length,
      unreadCount: unreadRow ? unreadRow.count : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin endpoint to update message status (read, archived, replied)
export const updateMessageStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['unread', 'read', 'archived', 'replied'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const existing = await dbGet('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await dbRun('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ success: true, message: `Message status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Superadmin endpoint to delete contact message
export const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await dbGet('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await dbRun('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
