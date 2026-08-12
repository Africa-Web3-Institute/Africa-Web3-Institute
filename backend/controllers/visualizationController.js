import { dbGet, dbAll, dbRun } from '../db/init.js';

// Get all research visualizations (with optional category or type filtering)
export const getVisualizations = async (req, res) => {
  const { category, type } = req.query;

  try {
    let query = 'SELECT * FROM visualizations';
    const params = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const rows = await dbAll(query, params);
    const data = rows.map(item => ({
      ...item,
      config: item.config ? JSON.parse(item.config) : {},
      data: item.data ? JSON.parse(item.data) : []
    }));

    res.status(200).json({
      data,
      count: data.length,
      kpiCompletedVisuals: data.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single visualization by slug or numeric ID
export const getVisualizationBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    let row = await dbGet('SELECT * FROM visualizations WHERE slug = ?', [slug]);
    if (!row && !isNaN(slug)) {
      row = await dbGet('SELECT * FROM visualizations WHERE id = ?', [parseInt(slug, 10)]);
    }

    if (!row) {
      return res.status(404).json({ error: 'Visualization not found' });
    }

    res.status(200).json({
      data: {
        ...row,
        config: row.config ? JSON.parse(row.config) : {},
        data: row.data ? JSON.parse(row.data) : []
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new research visualization spec
export const createVisualization = async (req, res) => {
  const { slug, title, category, type, description, config, data } = req.body;

  if (!slug || !title || !type) {
    return res.status(400).json({ error: 'Slug, title, and type are required fields.' });
  }

  try {
    const existing = await dbGet('SELECT * FROM visualizations WHERE slug = ?', [slug]);
    if (existing) {
      return res.status(400).json({ error: `Visualization with slug '${slug}' already exists.` });
    }

    const configStr = typeof config === 'object' ? JSON.stringify(config) : (config || '{}');
    const dataStr = typeof data === 'object' ? JSON.stringify(data) : (data || '[]');

    await dbRun(
      'INSERT INTO visualizations (slug, title, category, type, description, config, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [slug, title, category || 'General', type, description || '', configStr, dataStr]
    );

    res.status(201).json({ success: true, message: 'Visualization created successfully', slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing visualization spec or data
export const updateVisualization = async (req, res) => {
  const { id } = req.params;
  const { title, category, type, description, config, data } = req.body;

  try {
    const existing = await dbGet('SELECT * FROM visualizations WHERE id = ? OR slug = ?', [id, id]);
    if (!existing) {
      return res.status(404).json({ error: 'Visualization not found' });
    }

    const configStr = typeof config === 'object' ? JSON.stringify(config) : (config || existing.config);
    const dataStr = typeof data === 'object' ? JSON.stringify(data) : (data || existing.data);

    await dbRun(
      'UPDATE visualizations SET title = ?, category = ?, type = ?, description = ?, config = ?, data = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title || existing.title, category || existing.category, type || existing.type, description || existing.description, configStr, dataStr, existing.id]
    );

    res.status(200).json({ success: true, message: 'Visualization updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete visualization spec
export const deleteVisualization = async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await dbGet('SELECT * FROM visualizations WHERE id = ? OR slug = ?', [id, id]);
    if (!existing) {
      return res.status(404).json({ error: 'Visualization not found' });
    }

    await dbRun('DELETE FROM visualizations WHERE id = ?', [existing.id]);
    res.status(200).json({ success: true, message: 'Visualization deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
