import { dbGet, dbAll, dbRun } from '../db/init.js';

export const getSettings = async (req, res) => {
  try {
    const rows = await dbAll('SELECT key, value FROM settings');
    const settings = {};
    rows.forEach(r => settings[r.key] = r.value);
    res.status(200).json({ data: settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSettings = async (req, res) => {
  const settings = req.body;
  
  try {
    for (const [key, value] of Object.entries(settings)) {
      const existing = await dbGet('SELECT key FROM settings WHERE key = ?', [key]);
      if (existing) {
        await dbRun('UPDATE settings SET value = ? WHERE key = ?', [value, key]);
      } else {
        await dbRun('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
      }
    }
    res.status(200).json({ success: true, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
