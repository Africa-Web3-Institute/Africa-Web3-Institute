import { dbGet, dbAll, dbRun } from '../db/init.js';

// ---- Publications ----
export const getPublications = async (req, res) => {
  try {
    const publications = await dbAll('SELECT * FROM publications ORDER BY createdAt DESC');
    res.status(200).json({ data: publications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPublication = async (req, res) => {
  const { title, description, category, author, status, date, available, downloadUrl } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  try {
    await dbRun(
      'INSERT INTO publications (title, description, category, author, status, date, available, downloadUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || '', category || '', author || '', status || 'draft', date || '', available ? 1 : 0, downloadUrl || '']
    );
    res.status(201).json({ success: true, message: 'Publication created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePublication = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, author, status, date, available, downloadUrl } = req.body;
  
  try {
    await dbRun(
      'UPDATE publications SET title = ?, description = ?, category = ?, author = ?, status = ?, date = ?, available = ?, downloadUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description || '', category || '', author || '', status || 'draft', date || '', available ? 1 : 0, downloadUrl || '', id]
    );
    res.status(200).json({ success: true, message: 'Publication updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePublication = async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM publications WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Publication deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Enforcement ----
export const getEnforcements = async (req, res) => {
  try {
    const enforcements = await dbAll('SELECT * FROM enforcements ORDER BY createdAt DESC');
    res.status(200).json({ data: enforcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEnforcement = async (req, res) => {
  const { title, description, country, date, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  
  try {
    await dbRun(
      'INSERT INTO enforcements (title, description, country, date, status) VALUES (?, ?, ?, ?, ?)',
      [title, description, country, date, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Enforcement created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEnforcement = async (req, res) => {
  const { id } = req.params;
  const { title, description, country, date, status } = req.body;
  
  try {
    await dbRun(
      'UPDATE enforcements SET title = ?, description = ?, country = ?, date = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, country, date, status, id]
    );
    res.status(200).json({ success: true, message: 'Enforcement updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEnforcement = async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun('DELETE FROM enforcements WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'Enforcement deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- AWPII ----
export const getAwpiiScores = async (req, res) => {
  try {
    const scores = await dbAll('SELECT * FROM awpii_scores ORDER BY country ASC');
    const data = scores.map(s => ({ ...s, details: s.details ? JSON.parse(s.details) : {} }));
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAwpiiScore = async (req, res) => {
  const { country } = req.params;
  const { score, details } = req.body;
  
  if (score === undefined) return res.status(400).json({ error: 'Score is required' });
  
  try {
    const existing = await dbGet('SELECT * FROM awpii_scores WHERE country = ?', [country]);
    if (existing) {
      await dbRun(
        'UPDATE awpii_scores SET score = ?, details = ?, updatedAt = CURRENT_TIMESTAMP WHERE country = ?',
        [score, details, country]
      );
    } else {
      await dbRun(
        'INSERT INTO awpii_scores (country, score, details) VALUES (?, ?, ?)',
        [country, score, details]
      );
    }
    res.status(200).json({ success: true, message: 'AWPII score updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---- Tracker ----
export const getTrackerStatus = async (req, res) => {
  try {
    const statusList = await dbAll('SELECT * FROM tracker_status ORDER BY country ASC');
    const data = statusList.map(s => ({ ...s, details: s.details ? JSON.parse(s.details) : {} }));
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTrackerStatus = async (req, res) => {
  const { country } = req.params;
  const { status, details } = req.body;
  
  if (!status) return res.status(400).json({ error: 'Status is required' });
  
  try {
    const existing = await dbGet('SELECT * FROM tracker_status WHERE country = ?', [country]);
    if (existing) {
      await dbRun(
        'UPDATE tracker_status SET status = ?, details = ?, updatedAt = CURRENT_TIMESTAMP WHERE country = ?',
        [status, details, country]
      );
    } else {
      await dbRun(
        'INSERT INTO tracker_status (country, status, details) VALUES (?, ?, ?)',
        [country, status, details]
      );
    }
    res.status(200).json({ success: true, message: 'Tracker status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
