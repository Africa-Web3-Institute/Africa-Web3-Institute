import { dbGet, dbAll, dbRun } from "../db/init.js";

// ==========================================
// PUBLICATIONS
// ==========================================
export const getPublications = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let query = "SELECT * FROM publications WHERE 1=1";
    const params = [];

    if (category && category !== "all" && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }
    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ? OR author LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += " ORDER BY id ASC";
    const publications = await dbAll(query, params);
    res.status(200).json({ success: true, count: publications.length, data: publications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const pub = await dbGet("SELECT * FROM publications WHERE id = ?", [id]);
    if (!pub) return res.status(404).json({ success: false, error: "Publication not found" });
    res.status(200).json({ success: true, data: pub });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createPublication = async (req, res) => {
  const { title, description, category, author, status, date, available, downloadUrl } = req.body;
  if (!title) return res.status(400).json({ success: false, error: "Title is required" });
  
  try {
    await dbRun(
      "INSERT INTO publications (title, description, category, author, status, date, available, downloadUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description || "", category || "", author || "", status || "published", date || "", available ? 1 : 0, downloadUrl || ""]
    );
    res.status(201).json({ success: true, message: "Publication created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePublication = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, author, status, date, available, downloadUrl } = req.body;
  
  try {
    await dbRun(
      "UPDATE publications SET title = ?, description = ?, category = ?, author = ?, status = ?, date = ?, available = ?, downloadUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [title, description || "", category || "", author || "", status || "published", date || "", available ? 1 : 0, downloadUrl || "", id]
    );
    res.status(200).json({ success: true, message: "Publication updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePublication = async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun("DELETE FROM publications WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Publication deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// ARTICLES & NEWS
// ==========================================
export const getArticles = async (req, res) => {
  try {
    const { category, search, type, featured, limit = 50, offset = 0 } = req.query;
    let query = "SELECT * FROM articles WHERE status != \x27draft\x27";
    const params = [];

    if (category && category !== "all" && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }
    if (type && type !== "all") {
      query += " AND type = ?";
      params.push(type);
    }
    if (featured === "true" || featured === "1") {
      query += " AND featured = 1";
    }
    if (search) {
      query += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR author LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += " ORDER BY date DESC, id DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const articles = await dbAll(query, params);
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getArticleBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const article = await dbGet(
      "SELECT * FROM articles WHERE slug = ? OR id = ?",
      [slugOrId, slugOrId]
    );
    if (!article) return res.status(404).json({ success: false, error: "Article not found" });
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createArticle = async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, type = "article", author, authorRole, date, readTime, image, downloadUrl, available = 1, featured = 0, status = "published" } = req.body;
    if (!title || !category) return res.status(400).json({ success: false, error: "Title and category are required" });

    const artSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    await dbRun(
      "INSERT INTO articles (title, slug, excerpt, content, category, type, author, authorRole, date, readTime, image, downloadUrl, available, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, artSlug, excerpt || "", content || "", category, type, author || "AWI Team", authorRole || "", date || new Date().toISOString().split("T")[0], readTime || "4 min read", image || "", downloadUrl || "", available ? 1 : 0, featured ? 1 : 0, status]
    );

    const created = await dbGet("SELECT * FROM articles WHERE slug = ?", [artSlug]);
    res.status(201).json({ success: true, data: created, message: "Article created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, category, type, author, authorRole, date, readTime, image, downloadUrl, available, featured, status } = req.body;

    await dbRun(
      "UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, type = ?, author = ?, authorRole = ?, date = ?, readTime = ?, image = ?, downloadUrl = ?, available = ?, featured = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [title, slug, excerpt, content, category, type, author, authorRole, date, readTime, image, downloadUrl, available ? 1 : 0, featured ? 1 : 0, status || "published", id]
    );
    res.status(200).json({ success: true, message: "Article updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun("DELETE FROM articles WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// BLOGS
// ==========================================
export const getBlogs = async (req, res) => {
  try {
    const { category, search, featured, limit = 50, offset = 0 } = req.query;
    let query = "SELECT * FROM blogs WHERE isPublished = 1";
    const params = [];

    if (category && category !== "all" && category !== "All") {
      query += " AND category = ?";
      params.push(category);
    }
    if (featured === "true" || featured === "1") {
      query += " AND featured = 1";
    }
    if (search) {
      query += " AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ? OR tags LIKE ?)";
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += " ORDER BY publishedAt DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const blogs = await dbAll(query, params);
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getBlogBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const blog = await dbGet(
      "SELECT * FROM blogs WHERE slug = ? OR id = ?",
      [slugOrId, slugOrId]
    );
    if (!blog) return res.status(404).json({ success: false, error: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, author, authorRole, coverImage, tags, readTime, isPublished = 1, featured = 0 } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ success: false, error: "Title, content, and author are required" });
    }

    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    await dbRun(
      "INSERT INTO blogs (title, slug, excerpt, content, category, author, authorRole, coverImage, tags, readTime, isPublished, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, postSlug, excerpt || "", content, category || "General", author, authorRole || "", coverImage || "", tags || "", readTime || "5 min read", isPublished ? 1 : 0, featured ? 1 : 0]
    );

    const created = await dbGet("SELECT * FROM blogs WHERE slug = ?", [postSlug]);
    res.status(201).json({ success: true, data: created, message: "Blog post created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, category, author, authorRole, coverImage, tags, readTime, isPublished, featured } = req.body;

    await dbRun(
      "UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author = ?, authorRole = ?, coverImage = ?, tags = ?, readTime = ?, isPublished = ?, featured = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [title, slug, excerpt, content, category, author, authorRole, coverImage, tags, readTime, isPublished ? 1 : 0, featured ? 1 : 0, id]
    );
    res.status(200).json({ success: true, message: "Blog updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun("DELETE FROM blogs WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// ENFORCEMENT
// ==========================================
export const getEnforcements = async (req, res) => {
  try {
    const enforcements = await dbAll("SELECT * FROM enforcements ORDER BY createdAt DESC");
    res.status(200).json({ success: true, data: enforcements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createEnforcement = async (req, res) => {
  const { title, description, country, date, status } = req.body;
  if (!title) return res.status(400).json({ success: false, error: "Title is required" });
  
  try {
    await dbRun(
      "INSERT INTO enforcements (title, description, country, date, status) VALUES (?, ?, ?, ?, ?)",
      [title, description, country, date, status || "active"]
    );
    res.status(201).json({ success: true, message: "Enforcement created" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateEnforcement = async (req, res) => {
  const { id } = req.params;
  const { title, description, country, date, status } = req.body;
  
  try {
    await dbRun(
      "UPDATE enforcements SET title = ?, description = ?, country = ?, date = ?, status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
      [title, description, country, date, status, id]
    );
    res.status(200).json({ success: true, message: "Enforcement updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteEnforcement = async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun("DELETE FROM enforcements WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Enforcement deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// AWPII
// ==========================================
export const getAwpiiScores = async (req, res) => {
  try {
    const scores = await dbAll("SELECT * FROM awpii_scores ORDER BY country ASC");
    const data = scores.map(s => ({ ...s, details: s.details ? JSON.parse(s.details) : {} }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateAwpiiScore = async (req, res) => {
  const { country } = req.params;
  const { score, details } = req.body;
  
  if (score === undefined) return res.status(400).json({ success: false, error: "Score is required" });
  
  try {
    const existing = await dbGet("SELECT * FROM awpii_scores WHERE country = ?", [country]);
    if (existing) {
      await dbRun(
        "UPDATE awpii_scores SET score = ?, details = ?, updatedAt = CURRENT_TIMESTAMP WHERE country = ?",
        [score, typeof details === "string" ? details : JSON.stringify(details), country]
      );
    } else {
      await dbRun(
        "INSERT INTO awpii_scores (country, score, details) VALUES (?, ?, ?)",
        [country, score, typeof details === "string" ? details : JSON.stringify(details)]
      );
    }
    res.status(200).json({ success: true, message: "AWPII score updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ==========================================
// TRACKER
// ==========================================
export const getTrackerStatus = async (req, res) => {
  try {
    const statusList = await dbAll("SELECT * FROM tracker_status ORDER BY country ASC");
    const data = statusList.map(s => ({ ...s, details: s.details ? JSON.parse(s.details) : {} }));
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateTrackerStatus = async (req, res) => {
  const { country } = req.params;
  const { status, details } = req.body;
  
  if (!status) return res.status(400).json({ success: false, error: "Status is required" });
  
  try {
    const existing = await dbGet("SELECT * FROM tracker_status WHERE country = ?", [country]);
    if (existing) {
      await dbRun(
        "UPDATE tracker_status SET status = ?, details = ?, updatedAt = CURRENT_TIMESTAMP WHERE country = ?",
        [status, typeof details === "string" ? details : JSON.stringify(details), country]
      );
    } else {
      await dbRun(
        "INSERT INTO tracker_status (country, status, details) VALUES (?, ?, ?)",
        [country, status, typeof details === "string" ? details : JSON.stringify(details)]
      );
    }
    res.status(200).json({ success: true, message: "Tracker status updated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
