// src/api/api.js
// Base API client — all requests go through here
// Token is read from localStorage on every call so it's always fresh

// API_BASE already includes the /api prefix (matches the convention used
// by the contact page and elsewhere) -- so paths below must NOT repeat
// "/api/" themselves, or you get a doubled "/api/api/..." URL.
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function getToken() {
  try {
    const raw = localStorage.getItem("awi_admin_user");
    
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.token || null;
    
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const cleanPath = path.startsWith("/api/") ? path.replace(/^\/api/, "") : path;

  const res = await fetch(`${API_BASE}${cleanPath}`, {
    ...options,
    headers,
  });

  // A wrong email or password on the sign-in form is not an expired session
  const isLogin = cleanPath === "/admin/login";
  if (res.status === 401 && isLogin) {
    throw new Error("Wrong email or password. Check both and try again (the password is case-sensitive).");
  }

  // Handle 401 — token expired or invalid, or the account was disabled/removed: force logout
  if (res.status === 401) {
    let reason = "";
    try { reason = (await res.json())?.error || ""; } catch { /* not JSON */ }
    const message = /disabled/i.test(reason)
      ? "Your account has been disabled. Contact a superadmin."
      : /no longer exists/i.test(reason)
        ? "Your account has been removed. Contact a superadmin."
        : /password was changed/i.test(reason)
          ? "Your password was changed, so you were signed out. Sign in with the new password."
          : "Your session has expired. Please sign in again.";
    localStorage.removeItem("awi_admin_user");
    sessionStorage.setItem("awi_login_notice", message);
    window.location.href = "/admin/login";
    throw new Error(message);
  }

  

  // Try to parse JSON, fall back to text
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      (typeof data === "object" && data?.error) ||
      (typeof data === "object" && data?.message) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request("/admin/me"),
  changePassword: (currentPassword, newPassword) =>
    request("/admin/me/password", { method: "PUT", body: JSON.stringify({ currentPassword, newPassword }) }),
  permissions: () => request("/admin/permissions"),
  myActivity: (limit = 8) => request(`/admin/me/activity?limit=${limit}`),
  systemStatus: () => request("/admin/system"),
};

// ─── Publications ──────────────────────────────────────────────────────────
export const publicationsApi = {
  getAll: ()         => request("/publications"),
  getById: (id)      => request(`/publications/${id}`),
  create: (data)     => request("/publications",      { method: "POST",   body: JSON.stringify(data) }),
  update: (id, data) => request(`/publications/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
  remove: (id)       => request(`/publications/${id}`,{ method: "DELETE" }),
};

// ─── Enforcement Watch ─────────────────────────────────────────────────────
export const enforcementApi = {
  getAll: ()         => request("/enforcement"),
  create: (data)     => request("/enforcement",      { method: "POST",   body: JSON.stringify(data) }),
  update: (id, data) => request(`/enforcement/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
  remove: (id)       => request(`/enforcement/${id}`,{ method: "DELETE" }),
};

// ─── AWPII ─────────────────────────────────────────────────────────────────
export const awpiiApi = {
  getAll:  ()              => request("/awpii"),
  update:  (country, data) => request(`/awpii/${country}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Regulatory Tracker ────────────────────────────────────────────────────
export const trackerApi = {
  getAll:  ()              => request("/tracker"),
  update:  (country, data) => request(`/tracker/${country}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Analytics (no auth) ───────────────────────────────────────────────────
export const analyticsApi = {
  health:    ()     => fetch(`${API_BASE}/event`).then(r => r.json()),
  exportCsv: ()     => `${API_BASE}/export`,
  sseUrl:    ()     => `${API_BASE}/live`,
  ingest:    (data) => fetch(`${API_BASE}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
};


// ─── Articles (Public & Admin) ──────────────────────────────────────────────
export const articlesApi = {
  getAll: (params) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/articles${q}`);
  },
  getBySlug: (slug) => request(`/articles/${slug}`),
  create: (data) => request("/articles", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/articles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/articles/${id}`, { method: "DELETE" }),
};

// ─── Blogs & Thought Leadership ────────────────────────────────────────────
export const blogsApi = {
  getAll: (params) => {
    const q = params ? "?" + new URLSearchParams(params).toString() : "";
    return request(`/blogs${q}`);
  },
  getBySlug: (slug) => request(`/blogs/${slug}`),
  create: (data) => request("/blogs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/blogs/${id}`, { method: "DELETE" }),
};

// ─── Newsletters & Subscriptions ───────────────────────────────────────────
export const newsletterApi = {
  subscribe: (data) =>
    request("/subscribe", {
      method: "POST",
      body: JSON.stringify(typeof data === "string" ? { email: data } : data),
    }),
  getNewsletters: () => request("/newsletters"),
  getById: (id) => request(`/newsletters/${id}`),
  sendNewsletter: (data) =>
    request("/admin/newsletters/send", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getSubscribers: (params) => request(`/admin/subscribers${qs(params)}`),
  addSubscriber: (data) => request("/subscribers", { method: "POST", body: JSON.stringify(data) }),
  getCampaigns: () => request("/campaigns"),
  createCampaign: (data) => request("/campaigns", { method: "POST", body: JSON.stringify(data) }),
  getAnalytics: () => request("/analytics"),
};

// Build "?a=1&b=2" from an object, skipping empty values
function qs(params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return entries.length ? "?" + new URLSearchParams(entries).toString() : "";
}

// ─── System ────────────────────────────────────────────────────────────────
export const systemApi = {
  health: () => request("/health"),
};

// ─── Contact messages (Admin) ──────────────────────────────────────────────
export const contactApi = {
  getAll: (status) => request(`/contact-messages${qs({ status })}`),
  setStatus: (id, status) => request(`/contact-messages/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  remove: (id) => request(`/contact-messages/${id}`, { method: "DELETE" }), // needs messages.delete
};

// ─── Users & Settings (superadmin) ─────────────────────────────────────────
export const usersApi = {
  getAll: () => request("/admin/users"),
  create: (data) => request("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
};

// ─── Activity log (superadmin) ─────────────────────────────────────────────
export const activityApi = {
  list: (params) => request(`/admin/activity${qs(params)}`),
  summary: () => request("/admin/activity/summary"),
};

export const settingsApi = {
  get: () => request("/admin/settings"),
  update: (data) => request("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Research impact ───────────────────────────────────────────────────────
export const researchApi = {
  impact: () => request("/research-metrics/impact"),
  getCitations: (publicationId) => request(`/research-metrics/citations${qs({ publicationId })}`),
  addCitation: (data) => request("/research-metrics/citations", { method: "POST", body: JSON.stringify(data) }),
  removeCitation: (id) => request(`/research-metrics/citations/${id}`, { method: "DELETE" }),
};

// ─── State of Web3 in Africa ───────────────────────────────────────────────
export const web3Api = {
  dashboard: () => request("/state-of-web3/dashboard"),
  adoption: () => request("/state-of-web3/adoption"),
  getMetrics: (params) => request(`/state-of-web3/metrics${qs(params)}`),
  createMetric: (data) => request("/state-of-web3/metrics", { method: "POST", body: JSON.stringify(data) }),
  getStartups: (params) => request(`/state-of-web3/startups${qs(params)}`),
  createStartup: (data) => request("/state-of-web3/startups", { method: "POST", body: JSON.stringify(data) }),
  updateStartup: (id, data) => request(`/state-of-web3/startups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  removeStartup: (id) => request(`/state-of-web3/startups/${id}`, { method: "DELETE" }),
};

// ─── Research visualizations ───────────────────────────────────────────────
export const visualizationsApi = {
  getAll: (params) => request(`/visualizations${qs(params)}`),
  getBySlug: (slug) => request(`/visualizations/${slug}`),
  create: (data) => request("/visualizations", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/visualizations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/visualizations/${id}`, { method: "DELETE" }),
};

export const API_BASE_URL = API_BASE;
