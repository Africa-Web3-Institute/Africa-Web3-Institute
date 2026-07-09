// src/api/api.js
// Base API client — all requests go through here
// Token is read from localStorage on every call so it's always fresh

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

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

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle 401 — token expired or invalid, force logout
  if (res.status === 401) {
    
    localStorage.removeItem("awi_admin_user");
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please log in again.");
    
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
    request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Publications ──────────────────────────────────────────────────────────
export const publicationsApi = {
  getAll: ()         => request("/api/publications"),
  create: (data)     => request("/api/publications",      { method: "POST",   body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/publications/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
  remove: (id)       => request(`/api/publications/${id}`,{ method: "DELETE" }),
};

// ─── Enforcement Watch ─────────────────────────────────────────────────────
export const enforcementApi = {
  getAll: ()         => request("/api/enforcement"),
  create: (data)     => request("/api/enforcement",      { method: "POST",   body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/enforcement/${id}`,{ method: "PUT",    body: JSON.stringify(data) }),
  remove: (id)       => request(`/api/enforcement/${id}`,{ method: "DELETE" }),
};

// ─── AWPII ─────────────────────────────────────────────────────────────────
export const awpiiApi = {
  getAll:  ()              => request("/api/awpii"),
  update:  (country, data) => request(`/api/awpii/${country}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Regulatory Tracker ────────────────────────────────────────────────────
export const trackerApi = {
  getAll:  ()              => request("/api/tracker"),
  update:  (country, data) => request(`/api/tracker/${country}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Analytics (no auth) ───────────────────────────────────────────────────
export const analyticsApi = {
  health:    ()     => fetch(`${API_BASE}/api/event`).then(r => r.json()),
  exportCsv: ()     => `${API_BASE}/api/export`,
  sseUrl:    ()     => `${API_BASE}/api/live`,
  ingest:    (data) => fetch(`${API_BASE}/api/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
};

export const API_BASE_URL = API_BASE;
