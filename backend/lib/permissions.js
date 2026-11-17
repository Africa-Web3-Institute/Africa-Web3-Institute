// Roles and permissions for admin accounts.
//
// Every account has a role, which gives it a default set of permissions.
// A superadmin can then allow or deny individual permissions per account;
// those per-account changes are stored as overrides ({ key: true|false }) in
// users.permissions. Superadmins always have every permission, and only they
// can manage accounts or read the activity log; neither of those can be granted.

export const ROLES = ['superadmin', 'admin', 'editor'];

export const PERMISSIONS = [
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

const ALL = PERMISSIONS.map((p) => p.key);

export const ROLE_DEFAULTS = {
  superadmin: [...ALL],
  admin: ALL.filter((k) => k !== 'settings.manage'),
  editor: ['content.create', 'content.edit', 'messages.view', 'newsletter.view'],
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
  const set = new Set(ROLE_DEFAULTS[role] || ROLE_DEFAULTS.editor);
  for (const [key, allowed] of Object.entries(sanitizeOverrides(overrides))) {
    if (allowed) set.add(key);
    else set.delete(key);
  }
  return ALL.filter((k) => set.has(k));
};
