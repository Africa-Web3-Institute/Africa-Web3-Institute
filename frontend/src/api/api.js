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
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ─── Publications ──────────────────────────────────────────────────────────
export const publicationsApi = {
  getAll: ()         => request("/publications"),
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

export const API_BASE_URL = API_BASE;
