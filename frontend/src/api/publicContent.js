// src/api/publicContent.js
// Reads published articles + blogs for the PUBLIC site (no login).
// Plain fetch on purpose, not request(): a visitor must never be sent to the admin login page.
// Any failure just means "nothing from the server".
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const getJson = async (path) => {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const rows = (json) => (json && Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : []);

// Both tables -> one shape the pages already understand
export const toPost = (r, kind) => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt || "",
  category: r.category || (kind === "blog" ? "Thought Leadership" : "Published Articles"),
  author: r.author || "",
  authorRole: r.authorRole || "",
  date: r.date || r.publishedAt || r.createdAt || "",
  readTime: r.readTime || "",
  image: r.image || r.coverImage || "",
  body: r.content || "",
  kind,
});

const published = (r, kind) =>
  kind === "blog" ? r.isPublished === undefined || Boolean(Number(r.isPublished)) : r.status !== "draft";

export const publicContentApi = {
  getAll: async () => {
    const [a, b] = await Promise.all([getJson("/articles"), getJson("/blogs")]);
    const seen = new Set();
    return [
      ...rows(a).filter((r) => r.slug && published(r, "article")).map((r) => toPost(r, "article")),
      ...rows(b).filter((r) => r.slug && published(r, "blog")).map((r) => toPost(r, "blog")),
    ].filter((p) => (seen.has(p.slug) ? false : seen.add(p.slug)));
  },
  getOne: async (slug) => {
    const s = encodeURIComponent(slug);
    const a = await getJson(`/articles/${s}`);
    if (a && a.data && published(a.data, "article")) return toPost(a.data, "article");
    const b = await getJson(`/blogs/${s}`);
    if (b && b.data && published(b.data, "blog")) return toPost(b.data, "blog");
    return null;
  },
};

// Tells the backend a visitor clicked Download (it increments publications.downloads).
// Fire-and-forget: it must never block or break the download itself.
const sessionId = () => {
  try {
    let id = sessionStorage.getItem("awi_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("awi_sid", id);
    }
    return id;
  } catch {
    return "anonymous";
  }
};
export const trackDownload = (id) => {
  try {
    fetch(`${API_BASE}/publications/${encodeURIComponent(id)}/download?sessionId=${sessionId()}`, { keepalive: true }).catch(() => {});
  } catch {
    /* ignore */
  }
};
