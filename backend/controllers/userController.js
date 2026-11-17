import { dbGet, dbAll, dbRun } from '../db/init.js';
import bcrypt from 'bcryptjs';
import { PERMISSIONS, ROLES, SUPERADMIN_GRANTED, effectivePermissions, sanitizeOverrides } from '../lib/permissions.js';
import { isWeakPassword } from '../db/init.js';
import { invalidateDefaultPasswordCache } from './authController.js';

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
  jobTitle: u.jobTitle || '',
});

// Admins can manage admins, editors and viewers. Superadmin accounts are invisible to them:
// left out of the list, and treated as "not found" if addressed directly.
const actorIsSuper = (req) => req.user?.role === 'superadmin';
const rolesFor = (req) => (actorIsSuper(req) ? ROLES : ROLES.filter((r) => r !== 'superadmin'));
const roleError = (req) => ({ error: `Role must be one of: ${rolesFor(req).join(', ')}` });

// ── Activity log wording for account changes ──
const PERM_LABEL = { ...Object.fromEntries(PERMISSIONS.map((p) => [p.key, p.label])), 'users.manage': 'Manage accounts', 'activity.view': 'View activity log' };
const ROLE_NAME = { superadmin: 'Superadmin', admin: 'Admin', editor: 'Editor', viewer: 'Viewer' };
const labels = (keys) => keys.map((k) => PERM_LABEL[k] || k).join(', ');
const diffPermissions = (beforeList, afterList) => ({
  granted: afterList.filter((k) => !beforeList.includes(k)),
  removed: beforeList.filter((k) => !afterList.includes(k)),
});
const describe = (target, parts) => [target, parts.filter(Boolean).join(' · ')].filter(Boolean).join(' — ');

// Overrides an admin sends can't touch superadmin-granted permissions (e.g. site settings):
// whatever a superadmin decided for that account is kept.
const overridesFrom = (req, incoming, existingRaw) => {
  const next = sanitizeOverrides(incoming);
  if (actorIsSuper(req)) return next;
  const existing = sanitizeOverrides(existingRaw);
  for (const key of SUPERADMIN_GRANTED) {
    delete next[key];
    if (key in existing) next[key] = existing[key];
  }
  return next;
};

const activeSuperadmins = () => dbAll("SELECT id FROM users WHERE role = 'superadmin' AND COALESCE(active, 1) != 0");

export const getUsers = async (req, res) => {
  try {
    const users = await dbAll(
      `SELECT id, email, name, role, permissions, active, lastLoginAt, createdAt, jobTitle FROM users ${actorIsSuper(req) ? '' : "WHERE role != 'superadmin'"} ORDER BY createdAt DESC`
    );
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
  if (!rolesFor(req).includes(role)) return res.status(400).json(roleError(req));
  if (String(password).length < 10) return res.status(400).json({ error: 'Use a password of at least 10 characters' });
  if (isWeakPassword(password)) return res.status(400).json({ error: 'That password is too common. Choose another.' });

  try {
    const existing = await dbGet('SELECT id FROM users WHERE LOWER(email) = ?', [email]);
    if (existing) return res.status(400).json({ error: 'An account with this email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const overrides = role === 'superadmin' ? {} : overridesFrom(req, permissions, null);
    await dbRun(
      'INSERT INTO users (email, password, name, role, permissions, active) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, name || '', role, JSON.stringify(overrides), active ? 1 : 0]
    );
    const { granted, removed } = diffPermissions(effectivePermissions(role, {}), effectivePermissions(role, overrides));
    res.locals.activitySummary = describe(email, [
      `new account · role: ${ROLE_NAME[role] || role}`,
      granted.length && `granted: ${labels(granted)}`,
      removed.length && `removed: ${labels(removed)}`,
      !active && 'disabled',
    ]);
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
    if (!user || (user.role === 'superadmin' && !actorIsSuper(req))) return res.status(404).json({ error: 'User not found' });

    const sets = [];
    const params = [];
    const nextRole = body.role ?? user.role;
    const nextActive = typeof body.active === 'undefined' ? Number(user.active ?? 1) !== 0 : !!body.active;

    if (body.role !== undefined && !rolesFor(req).includes(body.role)) {
      return res.status(400).json(roleError(req));
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
    let nextOverrides = sanitizeOverrides(user.permissions);
    if (body.permissions !== undefined || (body.role === 'superadmin')) {
      nextOverrides = nextRole === 'superadmin' ? {} : overridesFrom(req, body.permissions, user.permissions);
      sets.push('permissions = ?');
      params.push(JSON.stringify(nextOverrides));
    }
    if (body.password) {
      if (String(body.password).length < 10) return res.status(400).json({ error: 'Use a password of at least 10 characters' });
      if (isWeakPassword(body.password)) return res.status(400).json({ error: 'That password is too common. Choose another.' });
      // Setting a new password signs that person out everywhere
      sets.push('password = ?', 'passwordChangedAt = CURRENT_TIMESTAMP'); params.push(await bcrypt.hash(body.password, 12));
    }

    if (sets.length) await dbRun(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
    if (body.password || body.active !== undefined) invalidateDefaultPasswordCache();

    // Exactly what changed, for the activity log
    const wasActive = Number(user.active ?? 1) !== 0;
    const nextEmail = body.email !== undefined ? String(body.email).trim().toLowerCase() : user.email;
    const { granted, removed } = diffPermissions(effectivePermissions(user.role, user.permissions), effectivePermissions(nextRole, nextOverrides));
    res.locals.activitySummary = describe(user.email, [
      nextEmail !== user.email && `email: ${user.email} → ${nextEmail}`,
      body.name !== undefined && (body.name || '') !== (user.name || '') && `name: ${user.name || '—'} → ${body.name || '—'}`,
      nextRole !== user.role && `role: ${ROLE_NAME[user.role] || user.role} → ${ROLE_NAME[nextRole] || nextRole}`,
      granted.length && `granted: ${labels(granted)}`,
      removed.length && `removed: ${labels(removed)}`,
      nextActive !== wasActive && (nextActive ? 'enabled' : 'disabled'),
      body.password && (id === req.user.id ? 'changed own password' : 'password reset'),
    ]) || `${user.email} — no changes`;
    res.status(200).json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (id === req.user.id) return res.status(400).json({ error: "You can't remove your own account" });

    const user = await dbGet('SELECT email, role, active FROM users WHERE id = ?', [id]);
    if (!user || (user.role === 'superadmin' && !actorIsSuper(req))) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'superadmin' && Number(user.active ?? 1) !== 0 && (await activeSuperadmins()).length <= 1) {
      return res.status(400).json({ error: 'Cannot delete the last superadmin' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [id]);
    invalidateDefaultPasswordCache();
    res.locals.activitySummary = describe(user.email, [`account removed (was ${ROLE_NAME[user.role] || user.role})`]);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
