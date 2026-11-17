// Activity log: records who changed what in the admin console.
import { dbGet, dbRun } from '../db/init.js';

// URL area -> table (for looking up an item's name before it is deleted) and a readable label
const AREAS = {
  publications: { table: 'publications', label: 'Publication' },
  articles: { table: 'articles', label: 'Article' },
  blogs: { table: 'blogs', label: 'Blog post' },
  enforcement: { table: 'enforcements', label: 'Enforcement case' },
  awpii: { label: 'AWPII score' },
  tracker: { label: 'Tracker status' },
  'contact-messages': { table: 'contact_messages', label: 'Message', nameCol: 'subject' },
  startups: { table: 'web3_startups', label: 'Startup', nameCol: 'name' },
  metrics: { label: 'Ecosystem metric' },
  citations: { table: 'citations', label: 'Citation', nameCol: 'citationSource' },
  visualizations: { table: 'visualizations', label: 'Visualization' },
  users: { table: 'users', label: 'User account', nameCol: 'email' },
  settings: { label: 'Settings' },
  campaigns: { label: 'Newsletter campaign' },
  newsletters: { label: 'Newsletter' },
  me: { label: 'Own account' },
};

// "/api/admin/users/3" -> { area: 'users', id: '3' }
const parsePath = (url) => {
  const parts = url.split('?')[0].split('/').filter(Boolean).filter((p) => p !== 'api' && p !== 'admin');
  if (parts[0] === 'state-of-web3' || parts[0] === 'research-metrics') parts.shift();
  if (parts[0] === 'newsletter') parts.shift();
  const area = parts[0] || 'unknown';
  return { area, id: parts[1] ? decodeURIComponent(parts[1]) : null, rest: parts.slice(2) };
};

const nameOf = (body = {}) =>
  body.title || body.name || body.citationSource || body.subject || body.email || body.country || null;

export const logActivity = async ({ user, action, entityType = null, entityId = null, summary = null, ip = null }) => {
  try {
    await dbRun(
      'INSERT INTO activity_log (userId, userEmail, userName, action, entityType, entityId, summary, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user?.id ?? null, user?.email ?? null, user?.name ?? null, action, entityType, entityId == null ? null : String(entityId), summary, ip]
    );
  } catch (err) {
    console.error('Could not write activity log:', err.message);
  }
};

const clientIp = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || null;

// Express middleware (runs after authentication): logs successful changes
export const trackActivity = async (req, res, next) => {
  const method = req.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return next();

  const { area, id, rest } = parsePath(req.originalUrl);
  const info = AREAS[area] || { label: area };
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  // Before a delete (or an account change), note the item's name: it may not be in the request
  let deletedName = null;
  if ((method === 'DELETE' || area === 'users') && info.table && id) {
    try {
      const col = info.nameCol || 'title';
      const row = await dbGet(`SELECT ${col} AS n FROM ${info.table} WHERE id = ?${info.table === 'visualizations' ? ' OR slug = ?' : ''}`,
        info.table === 'visualizations' ? [id, id] : [id]);
      deletedName = row?.n || null;
    } catch { /* name is optional */ }
  }

  res.on('finish', () => {
    if (res.statusCode >= 400) return;
    let action = method === 'POST' ? 'create' : method === 'DELETE' ? 'delete' : 'update';
    let summary = method === 'DELETE' ? deletedName : nameOf(body);

    if (area === 'newsletters' && (id === 'send' || rest.includes('send'))) {
      action = 'send';
      summary = body.subject || body.title || null;
    } else if (area === 'awpii' || area === 'tracker') {
      summary = [id, body.score != null ? `score ${body.score}` : body.status].filter(Boolean).join(' — ');
    } else if (area === 'contact-messages' && method !== 'DELETE') {
      summary = body.status ? `Marked ${body.status}` : summary;
    } else if (area === 'users') {
      const notes = [];
      if (body.role) notes.push(`role: ${body.role}`);
      if (method === 'POST') notes.push('new account');
      else if (body.password) notes.push('password changed');
      if (body.permissions) notes.push('permissions changed');
      if (typeof body.active !== 'undefined') notes.push(body.active ? 'enabled' : 'disabled');
      summary = [deletedName || body.email || summary, notes.join(', ')].filter(Boolean).join(' — ');
    } else if (area === 'settings') {
      summary = `Changed: ${Object.keys(body).join(', ')}`.slice(0, 300);
    } else if (area === 'me') {
      action = 'update';
      summary = id === 'profile' ? 'Updated own profile' : 'Changed own password';
    }

    logActivity({
      user: req.user,
      action,
      entityType: info.label,
      entityId: area === 'awpii' || area === 'tracker' ? null : id,
      summary: summary ? String(summary).slice(0, 300) : null,
      ip: clientIp(req),
    });
  });
  next();
};

export { clientIp };
