import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbAll, dbGet, dbRun, DB_STATUS, isWeakPassword } from '../db/init.js';
import { JWT_SECRET, JWT_SECRET_CONFIGURED } from '../middleware/auth.js';
import { PERMISSIONS, ROLE_DEFAULTS, SUPERADMIN_GRANTED, effectivePermissions } from '../lib/permissions.js';
import { logActivity, clientIp } from '../lib/activity.js';

const publicUser = (user) => {
  const { password: _, passwordChangedAt: __, mustChangePassword: ___, permissions: overrides, ...rest } = user;
  return {
    ...rest,
    permissions: effectivePermissions(user.role, overrides),
  };
};

// Brute-force protection: after 5 wrong passwords for the same email from the same address
// within 15 minutes, further attempts are refused for 15 minutes.
const FAIL_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map(); // "email|ip" -> [timestamps]
const recentFailures = (key) => (failures.get(key) || []).filter((t) => Date.now() - t < WINDOW_MS);
const signToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

export const login = async (req, res) => {
  const email = String(req.body?.email || '').trim();
  const { password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const key = `${email.toLowerCase()}|${clientIp(req)}`;
  const recent = recentFailures(key);
  if (recent.length >= FAIL_LIMIT) {
    const mins = Math.ceil((WINDOW_MS - (Date.now() - recent[0])) / 60000);
    return res.status(429).json({ error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? '' : 's'}.` });
  }

  try {
    // Emails are matched case-insensitively ("Yves@..." and "yves@..." are the same account)
    const user = await dbGet('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!isMatch) {
      failures.set(key, [...recent, Date.now()]);
      await logActivity({ user: user ? { id: user.id, email: user.email, name: user.name } : { email }, action: 'login_failed', entityType: 'Sign-in', summary: 'Wrong email or password', ip: clientIp(req) });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (Number(user.active ?? 1) === 0) {
      await logActivity({ user, action: 'login_failed', entityType: 'Sign-in', summary: 'Account is disabled', ip: clientIp(req) });
      return res.status(403).json({ error: 'This account has been disabled. Contact your administrator.' });
    }

    // The old built-in default (and other common passwords) can't be used to sign in
    if (isWeakPassword(password)) {
      await logActivity({ user, action: 'login_failed', entityType: 'Sign-in', summary: 'Blocked: default or common password', ip: clientIp(req) });
      return res.status(403).json({ error: 'This account still uses a default password, which is no longer allowed. Ask your administrator to set a new password for you.' });
    }

    failures.delete(key);
    await dbRun('UPDATE users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
    await logActivity({ user, action: 'login', entityType: 'Sign-in', ip: clientIp(req) });

    const token = signToken(user);

    res.status(200).json({ token, user: publicUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// The signed-in account, with its current role and permissions
export const me = async (req, res) => {
  try {
    const user = await dbGet('SELECT id, email, name, role, permissions, active, lastLoginAt, createdAt, jobTitle, phone, bio FROM users WHERE id = ?', [req.user.id]);
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
  if (isWeakPassword(newPassword)) return res.status(400).json({ error: 'That password is too common. Choose another.' });
  if (currentPassword === newPassword) return res.status(400).json({ error: 'Choose a new password that is different from the current one' });

  try {
    const user = await dbGet('SELECT id, password FROM users WHERE id = ?', [req.user.id]);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'Your current password is incorrect' });
    }
    await dbRun('UPDATE users SET password = ?, passwordChangedAt = CURRENT_TIMESTAMP WHERE id = ?', [await bcrypt.hash(newPassword, 12), req.user.id]);
    invalidateDefaultPasswordCache();
    // Other sessions for this account are now signed out; this one gets a fresh token
    const fresh = await dbGet('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json({ success: true, message: 'Password changed', token: signToken(fresh) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Any signed-in account updates its own profile (only the name is required).
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
export const updateProfile = async (req, res) => {
  const body = req.body || {};
  const name = clean(body.name, 80);
  const jobTitle = clean(body.jobTitle, 80);
  const phone = clean(body.phone, 30);
  const bio = String(body.bio ?? '').trim().slice(0, 300);
  if (name.length < 2) return res.status(400).json({ error: 'Enter your full name' });
  if (phone && !/^[+()\d\s.-]{6,30}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid phone number, or leave it empty' });
  try {
    await dbRun('UPDATE users SET name = ?, jobTitle = ?, phone = ?, bio = ? WHERE id = ?', [name, jobTitle, phone, bio, req.user.id]);
    const user = await dbGet('SELECT id, email, name, role, permissions, active, lastLoginAt, createdAt, jobTitle, phone, bio FROM users WHERE id = ?', [req.user.id]);
    res.status(200).json({ success: true, user: publicUser(user) });
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

// Accounts still on the old built-in default. Checking hashes is deliberately slow, so the
// result is cached and recalculated only after a password changes (or every 10 minutes).
let defaultPwCache = null;
export const invalidateDefaultPasswordCache = () => { defaultPwCache = null; };
const defaultPasswordAccountsCached = async () => {
  if (defaultPwCache && Date.now() - defaultPwCache.at < 10 * 60 * 1000) return defaultPwCache.value;
  const users = await dbAll('SELECT email, password FROM users WHERE COALESCE(active, 1) != 0');
  const value = [];
  for (const u of users) if (await bcrypt.compare('admin', u.password)) value.push(u.email);
  defaultPwCache = { at: Date.now(), value };
  return value;
};

// Superadmin health check: is the data safe across deploys, and is anything insecure?
export const systemStatus = async (req, res) => {
  try {
    const defaultPasswordAccounts = await defaultPasswordAccountsCached();
    res.status(200).json({
      database: { persistent: DB_STATUS.persistent, onRailway: DB_STATUS.onRailway, volume: DB_STATUS.volume, path: DB_STATUS.path },
      jwtSecretConfigured: JWT_SECRET_CONFIGURED,
      recoveryVariablesSet: !!(process.env.SUPERADMIN_EMAIL || process.env.SUPERADMIN_PASSWORD),
      defaultPasswordAccounts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// The permission list and each role's defaults, for the User Management screen
export const permissionCatalog = (req, res) => {
  const isSuper = req.user?.role === 'superadmin';
  const roleDefaults = { ...ROLE_DEFAULTS };
  if (!isSuper) delete roleDefaults.superadmin;
  // Admins don't see permissions only a superadmin can grant
  const permissions = isSuper
    ? PERMISSIONS.map((p) => (SUPERADMIN_GRANTED.includes(p.key) ? { ...p, superadminOnly: true } : p))
    : PERMISSIONS.filter((p) => !SUPERADMIN_GRANTED.includes(p.key));
  res.status(200).json({ permissions, roleDefaults });
};
