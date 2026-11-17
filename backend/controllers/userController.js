import { dbGet, dbAll, dbRun } from '../db/init.js';
import bcrypt from 'bcryptjs';
import { ROLES, effectivePermissions, sanitizeOverrides } from '../lib/permissions.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const shape = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  active: Number(u.active ?? 1) !== 0,
  overrides: sanitizeOverrides(u.permissions),
  permissions: effectivePermissions(u.role, u.permissions),
  lastLoginAt: u.lastLoginAt || null,
  createdAt: u.createdAt,
});

const activeSuperadmins = () => dbAll("SELECT id FROM users WHERE role = 'superadmin' AND COALESCE(active, 1) != 0");

export const getUsers = async (req, res) => {
  try {
    const users = await dbAll('SELECT id, email, name, role, permissions, active, lastLoginAt, createdAt FROM users ORDER BY createdAt DESC');
    res.status(200).json({ data: users.map(shape) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  const { password, name, role = 'editor', permissions, active = true } = req.body || {};
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
  if (!ROLES.includes(role)) return res.status(400).json({ error: `Role must be one of: ${ROLES.join(', ')}` });
  if (String(password).length < 10) return res.status(400).json({ error: 'Use a password of at least 10 characters' });

  try {
    const existing = await dbGet('SELECT id FROM users WHERE LOWER(email) = ?', [email]);
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO users (email, password, name, role, permissions, active) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name || '', role, JSON.stringify(role === 'superadmin' ? {} : sanitizeOverrides(permissions)), active ? 1 : 0]
    );
    res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Partial update: only the fields that are sent are changed
export const updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};

  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const sets = [];
    const params = [];
    const nextRole = body.role ?? user.role;
    const nextActive = typeof body.active === 'undefined' ? Number(user.active ?? 1) !== 0 : !!body.active;

    if (body.role !== undefined && !ROLES.includes(body.role)) {
      return res.status(400).json({ error: `Role must be one of: ${ROLES.join(', ')}` });
    }

    // Never leave the site without an active superadmin
    const wasActiveSuper = user.role === 'superadmin' && Number(user.active ?? 1) !== 0;
    if (wasActiveSuper && (nextRole !== 'superadmin' || !nextActive)) {
      const supers = await activeSuperadmins();
      if (supers.length <= 1) {
        return res.status(400).json({ error: 'This is the only active superadmin. Make another account superadmin first.' });
      }
    }
    if (id === req.user.id && !nextActive) {
      return res.status(400).json({ error: "You can't disable your own account" });
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
      const clash = await dbGet('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?', [email, id]);
      if (clash) return res.status(400).json({ error: 'Another account already uses this email' });
      sets.push('email = ?'); params.push(email);
    }
    if (body.name !== undefined) { sets.push('name = ?'); params.push(body.name || ''); }
    if (body.role !== undefined) { sets.push('role = ?'); params.push(body.role); }
    if (body.active !== undefined) { sets.push('active = ?'); params.push(nextActive ? 1 : 0); }
    if (body.permissions !== undefined || (body.role === 'superadmin')) {
      sets.push('permissions = ?');
      params.push(JSON.stringify(nextRole === 'superadmin' ? {} : sanitizeOverrides(body.permissions)));
    }
    if (body.password) {
      if (String(body.password).length < 10) return res.status(400).json({ error: 'Use a password of at least 10 characters' });
      sets.push('password = ?'); params.push(await bcrypt.hash(body.password, 10));
    }

    if (sets.length) await dbRun(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
    res.status(200).json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (id === req.user.id) return res.status(400).json({ error: "You can't remove your own account" });

    const user = await dbGet('SELECT role, active FROM users WHERE id = ?', [id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'superadmin' && Number(user.active ?? 1) !== 0 && (await activeSuperadmins()).length <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last superadmin' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
