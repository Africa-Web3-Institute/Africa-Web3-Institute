import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbAll, dbGet, dbRun } from '../db/init.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { PERMISSIONS, ROLE_DEFAULTS, effectivePermissions } from '../lib/permissions.js';
import { logActivity, clientIp } from '../lib/activity.js';

const publicUser = (user) => {
  const { password: _, permissions: overrides, ...rest } = user;
  return { ...rest, permissions: effectivePermissions(user.role, overrides) };
};

export const login = async (req, res) => {
  const email = String(req.body?.email || '').trim();
  const { password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Emails are matched case-insensitively ("Yves@..." and "yves@..." are the same account)
    const user = await dbGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      await logActivity({ user: user ? { id: user.id, email: user.email, name: user.name } : { email }, action: 'login_failed', entityType: 'Sign-in', summary: 'Wrong email or password', ip: clientIp(req) });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (Number(user.active ?? 1) === 0) {
      await logActivity({ user, action: 'login_failed', entityType: 'Sign-in', summary: 'Account is disabled', ip: clientIp(req) });
      return res.status(403).json({ error: 'This account has been disabled. Contact a superadmin.' });
    }

    await dbRun('UPDATE users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    await logActivity({ user, action: 'login', entityType: 'Sign-in', ip: clientIp(req) });

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// The signed-in account, with its current role and permissions
export const me = async (req, res) => {
  try {
    const user = await dbGet('SELECT id, email, name, role, permissions, active, lastLoginAt, createdAt FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Any signed-in account can change its own password
export const changeOwnPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password are required' });
  if (String(newPassword).length < 10) return res.status(400).json({ error: 'Use a new password of at least 10 characters' });

  try {
    const user = await dbGet('SELECT id, password FROM users WHERE id = ?', [req.user.id]);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'Your current password is incorrect' });
    }
    await dbRun('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 10), req.user.id]);
    res.status(200).json({ success: true, message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// The signed-in account's own recent activity (for its dashboard)
export const myActivity = async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  try {
    const rows = await dbAll(
      "SELECT id, action, entityType, entityId, summary, createdAt FROM activity_log WHERE userId = ? AND action NOT IN ('login', 'login_failed') ORDER BY id DESC LIMIT ?",
      [req.user.id, limit]
    );
    const totals = await dbGet(
      `SELECT SUM(CASE WHEN action = 'create' THEN 1 ELSE 0 END) AS created,
              SUM(CASE WHEN action = 'update' THEN 1 ELSE 0 END) AS updated,
              SUM(CASE WHEN action = 'delete' THEN 1 ELSE 0 END) AS deleted
       FROM activity_log WHERE userId = ? AND createdAt >= datetime('now', '-30 days')`,
      [req.user.id]
    );
    res.status(200).json({ data: rows, last30Days: { created: totals?.created || 0, updated: totals?.updated || 0, deleted: totals?.deleted || 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// The permission list and each role's defaults, for the User Management screen
export const permissionCatalog = (req, res) => {
  res.status(200).json({ permissions: PERMISSIONS, roleDefaults: ROLE_DEFAULTS });
};
