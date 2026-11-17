import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { dbGet } from '../db/init.js';
import { effectivePermissions } from '../lib/permissions.js';
import { trackActivity } from '../lib/activity.js';

// Sessions are signed with JWT_SECRET. The old fallback was a fixed string in the public
// code, which would let anyone forge a session; in production a missing secret now gets a
// random one instead (sessions then end on each restart, but can't be forged).
const IS_PROD = process.env.NODE_ENV === 'production' || !!(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME || process.env.RAILWAY_PROJECT_ID);
export const JWT_SECRET_CONFIGURED = !!process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32;
export const JWT_SECRET = process.env.JWT_SECRET || (IS_PROD ? crypto.randomBytes(48).toString('hex') : 'local-development-only-secret');
if (IS_PROD && !JWT_SECRET_CONFIGURED) {
  console.error('🚨 JWT_SECRET is missing or shorter than 32 characters. Set a long random value in the hosting variables.');
}

// The only requests allowed while an account must still replace a password someone else set
const SETUP_ROUTES = [/^GET \/api\/admin\/me$/, /^PUT \/api\/admin\/me\/(password|profile)$/, /^GET \/api\/admin\/permissions$/];

// A session issued before the account's password last changed is no longer valid
const sqliteTime = (v) => (v ? Math.floor(Date.parse(String(v).replace(' ', 'T') + (String(v).includes('Z') ? '' : 'Z')) / 1000) : 0);
const sessionOutdated = (decoded, user) => !!user.passwordChangedAt && Number(decoded.iat || 0) < sqliteTime(user.passwordChangedAt);

// Checks the token, then loads the account fresh from the database so role or
// permission changes, disabled accounts and removed accounts take effect at once
// (not only when the token expires). Successful changes are written to the activity log.
export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer token' });
  }

  let decoded;
  try {
    decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  try {
    const user = await dbGet('SELECT id, email, name, role, permissions, active, passwordChangedAt, mustChangePassword FROM users WHERE id = ?', [decoded.id]);
    if (!user) return res.status(401).json({ error: 'Unauthorized: This account no longer exists' });
    if (Number(user.active ?? 1) === 0) return res.status(401).json({ error: 'This account has been disabled' });
    if (sessionOutdated(decoded, user)) return res.status(401).json({ error: 'Your password was changed. Please sign in again.' });
    // A password someone else set (new account, reset, recovery) must be replaced before anything else
    if (Number(user.mustChangePassword || 0) === 1 && !SETUP_ROUTES.some((r) => r.test(`${req.method} ${req.originalUrl.split('?')[0]}`))) {
      return res.status(403).json({ error: 'Set your own password in Settings before continuing.', code: 'PASSWORD_CHANGE_REQUIRED' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: effectivePermissions(user.role, user.permissions),
    };
  } catch (err) {
    console.error('Auth lookup failed:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }

  return trackActivity(req, res, next);
};

// For public endpoints that show extra data to signed-in staff (e.g. drafts):
// sets req.user when a valid token for an active account is sent, otherwise carries on.
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    const user = await dbGet('SELECT id, email, name, role, permissions, active, passwordChangedAt FROM users WHERE id = ?', [decoded.id]);
    if (user && Number(user.active ?? 1) !== 0 && !sessionOutdated(decoded, user)) {
      req.user = { id: user.id, email: user.email, name: user.name, role: user.role, permissions: effectivePermissions(user.role, user.permissions) };
    }
  } catch { /* invalid token: treat as a public visitor */ }
  next();
};

export const requireSuperadmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden: your account doesn't have access to this" });
  }
};

// Use after requireAuth: requirePermission('content.delete')
export const requirePermission = (key) => (req, res, next) => {
  if (req.user?.permissions?.includes(key)) return next();
  return res.status(403).json({ error: `Forbidden: your account doesn't have the "${key}" permission` });
};
