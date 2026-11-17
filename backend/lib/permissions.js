// Roles and permissions for admin accounts.
//
// Every account has a role, which gives it a default set of permissions.
// Superadmins and admins can then allow or deny individual permissions per account;
// those per-account changes are stored as overrides ({ key: true|false }) in
// users.permissions. Superadmins always have every permission. Managing accounts comes
// with the admin role (never with an override); only superadmins read the activity log.

export const ROLES = ['superadmin', 'admin', 'editor', 'viewer'];

export const PERMISSIONS = [
  { key: 'content.view', group: 'Access', label: 'Open content & intelligence pages', description: 'See the Content and Intelligence sections of the console' },
  { key: 'analytics.view', group: 'Access', label: 'View site analytics', description: 'See visitor numbers and the Site Analytics page' },
  { key: 'content.create', group: 'Content', label: 'Create content', description: 'Add publications, articles, blogs, enforcement cases, startups, visualizations and citations' },
  { key: 'content.edit', group: 'Content', label: 'Edit content', description: 'Change existing content, including publishing and unpublishing it' },
  { key: 'content.delete', group: 'Content', label: 'Delete content', description: 'Permanently remove content' },
  { key: 'policy.edit', group: 'Intelligence', label: 'Edit AWPII & tracker', description: 'Change AWPII scores and regulatory tracker statuses' },
  { key: 'messages.view', group: 'Inbox', label: 'Read messages', description: 'Read contact form messages and mark them read or archived' },
  { key: 'messages.delete', group: 'Inbox', label: 'Delete messages', description: 'Permanently remove contact form messages' },
  { key: 'newsletter.view', group: 'Newsletter', label: 'View newsletter', description: 'See subscribers, campaigns and newsletter statistics' },
  { key: 'newsletter.send', group: 'Newsletter', label: 'Send newsletters', description: 'Create campaigns and send newsletters to subscribers' },
  { key: 'settings.manage', group: 'System', label: 'Manage settings', description: 'Change site-wide settings' },
];

// Only ever held by superadmins
export const SUPERADMIN_ONLY = ['users.manage', 'activity.view'];

// Come with the role itself and can't be granted per account (otherwise an editor given
// "manage users" could make themselves an admin). Admins manage admins, editors and viewers;
// only superadmins can touch superadmin accounts.
export const ROLE_EXTRAS = { admin: ['users.manage'] };

// Only a superadmin may grant or remove these on any account (admins can't see or change them)
export const SUPERADMIN_GRANTED = ['settings.manage'];

const ALL = PERMISSIONS.map((p) => p.key);

export const ROLE_DEFAULTS = {
  superadmin: [...ALL],
  admin: ALL.filter((k) => k !== 'settings.manage'),
  editor: ['content.view', 'analytics.view', 'content.create', 'content.edit', 'content.delete', 'messages.view', 'newsletter.view'],
  viewer: ['content.view', 'analytics.view'],
};

// Accepts the stored JSON (or an object) and keeps only known keys with boolean values
export const sanitizeOverrides = (raw) => {
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch { obj = null; }
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
  const out = {};
  for (const key of ALL) {
    if (typeof obj[key] === 'boolean') out[key] = obj[key];
  }
  return out;
};

// The permissions an account actually has: role defaults, then its overrides
export const effectivePermissions = (role, overrides) => {
  if (role === 'superadmin') return [...ALL, ...SUPERADMIN_ONLY];
  const set = new Set(ROLE_DEFAULTS[role] || ROLE_DEFAULTS.viewer);
  for (const [key, allowed] of Object.entries(sanitizeOverrides(overrides))) {
    if (allowed) set.add(key);
    else set.delete(key);
  }
  return [...ALL.filter((k) => set.has(k)), ...(ROLE_EXTRAS[role] || [])];
};
