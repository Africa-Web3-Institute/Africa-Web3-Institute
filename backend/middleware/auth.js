import jwt from 'jsonwebtoken';
import { dbGet } from '../db/init.js';
import { effectivePermissions } from '../lib/permissions.js';
import { trackActivity } from '../lib/activity.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_for_awi_change_me_later';

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
    const user = await dbGet('SELECT id, email, name, role, permissions, active FROM users WHERE id = ?', [decoded.id]);
    if (!user) return res.status(401).json({ error: 'Unauthorized: This account no longer exists' });
    if (Number(user.active ?? 1) === 0) return res.status(401).json({ error: 'This account has been disabled' });

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

export const requireSuperadmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Superadmin role required' });
  }
};

// Use after requireAuth: requirePermission('content.delete')
export const requirePermission = (key) => (req, res, next) => {
  if (req.user?.permissions?.includes(key)) return next();
  return res.status(403).json({ error: `Forbidden: your account doesn't have the "${key}" permission` });
};
