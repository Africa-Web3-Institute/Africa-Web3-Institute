import express from 'express';
import { dbAll, dbGet } from '../db/init.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

// Only superadmins can see what every account has done
router.use(requireAuth, requireSuperadmin);

// GET /api/admin/activity?userId=&action=&entityType=&q=&from=&to=&limit=&offset=
router.get('/', async (req, res) => {
  const { userId, action, entityType, q, from, to } = req.query;
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
  const offset = Math.max(Number(req.query.offset) || 0, 0);

  const where = [];
  const params = [];
  if (userId) { where.push('userId = ?'); params.push(Number(userId)); }
  if (action) { where.push('action = ?'); params.push(action); }
  if (entityType) { where.push('entityType = ?'); params.push(entityType); }
  if (from) { where.push('createdAt >= ?'); params.push(from); }
  if (to) { where.push('createdAt <= ?'); params.push(`${to} 23:59:59`); }
  if (q) {
    where.push('(summary LIKE ? OR userEmail LIKE ? OR userName LIKE ? OR entityType LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  try {
    const rows = await dbAll(`SELECT * FROM activity_log ${clause} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const total = (await dbGet(`SELECT COUNT(*) AS n FROM activity_log ${clause}`, params))?.n || 0;
    const entityTypes = (await dbAll('SELECT DISTINCT entityType FROM activity_log WHERE entityType IS NOT NULL ORDER BY entityType')).map((r) => r.entityType);
    res.status(200).json({ data: rows, total, limit, offset, entityTypes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/activity/summary — one row per account: totals and last activity
router.get('/summary', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, email, name, role, active, lastLoginAt FROM users ORDER BY role, email');
    const stats = await dbAll(`
      SELECT userId,
        COUNT(*) AS total,
        SUM(CASE WHEN action = 'create' THEN 1 ELSE 0 END) AS created,
        SUM(CASE WHEN action = 'update' THEN 1 ELSE 0 END) AS updated,
        SUM(CASE WHEN action = 'delete' THEN 1 ELSE 0 END) AS deleted,
        SUM(CASE WHEN action = 'login_failed' THEN 1 ELSE 0 END) AS failedLogins,
        MAX(createdAt) AS lastActivityAt
      FROM activity_log WHERE userId IS NOT NULL GROUP BY userId`);
    const byUser = Object.fromEntries(stats.map((s) => [s.userId, s]));
    res.status(200).json({
      data: users.map((u) => ({
        ...u,
        active: Number(u.active ?? 1) !== 0,
        total: 0, created: 0, updated: 0, deleted: 0, failedLogins: 0, lastActivityAt: null,
        ...(byUser[u.id] || {}),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
