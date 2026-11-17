import express from "express";
import {
  getPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getArticles,
  getArticleBySlugOrId,
  createArticle,
  updateArticle,
  deleteArticle,
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
  getEnforcements,
  createEnforcement,
  updateEnforcement,
  deleteEnforcement,
  getAwpiiScores,
  updateAwpiiScore,
  getTrackerStatus,
  updateTrackerStatus
} from "../controllers/contentController.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = express.Router();

// ==========================================
// PUBLIC GET ROUTES (For Frontend)
// ==========================================

// Publications
router.get("/publications", getPublications);
router.get("/publications/:id", getPublicationById);

// Articles / News
router.get("/articles", getArticles);
router.get("/articles/:slugOrId", getArticleBySlugOrId);

// Blogs & Thought Leadership
router.get("/blogs", getBlogs);
router.get("/blogs/:slugOrId", getBlogBySlugOrId);

// Enforcement Watch
router.get("/enforcement", getEnforcements);

// AWPII Scores
router.get("/awpii", getAwpiiScores);

// Tracker Status
router.get("/tracker", getTrackerStatus);


// ==========================================
// PROTECTED ADMIN WRITE ROUTES
// ==========================================

// Publications (Admin)
router.post("/publications", requireAuth, requirePermission("content.create"), createPublication);
router.put("/publications/:id", requireAuth, requirePermission("content.edit"), updatePublication);
router.delete("/publications/:id", requireAuth, requirePermission("content.delete"), deletePublication);

// Articles (Admin)
router.post("/articles", requireAuth, requirePermission("content.create"), createArticle);
router.put("/articles/:id", requireAuth, requirePermission("content.edit"), updateArticle);
router.delete("/articles/:id", requireAuth, requirePermission("content.delete"), deleteArticle);

// Blogs (Admin)
router.post("/blogs", requireAuth, requirePermission("content.create"), createBlog);
router.put("/blogs/:id", requireAuth, requirePermission("content.edit"), updateBlog);
router.delete("/blogs/:id", requireAuth, requirePermission("content.delete"), deleteBlog);

// Enforcement (Admin)
router.post("/enforcement", requireAuth, requirePermission("content.create"), createEnforcement);
router.put("/enforcement/:id", requireAuth, requirePermission("content.edit"), updateEnforcement);
router.delete("/enforcement/:id", requireAuth, requirePermission("content.delete"), deleteEnforcement);

// AWPII (Admin)
router.put("/awpii/:country", requireAuth, requirePermission("policy.edit"), updateAwpiiScore);

// Tracker (Admin)
router.put("/tracker/:country", requireAuth, requirePermission("policy.edit"), updateTrackerStatus);

export default router;
