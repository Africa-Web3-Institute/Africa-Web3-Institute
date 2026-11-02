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
import { requireAuth, requireSuperadmin } from "../middleware/auth.js";

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
router.post("/publications", requireAuth, createPublication);
router.put("/publications/:id", requireAuth, updatePublication);
router.delete("/publications/:id", requireAuth, requireSuperadmin, deletePublication);

// Articles (Admin)
router.post("/articles", requireAuth, createArticle);
router.put("/articles/:id", requireAuth, updateArticle);
router.delete("/articles/:id", requireAuth, requireSuperadmin, deleteArticle);

// Blogs (Admin)
router.post("/blogs", requireAuth, createBlog);
router.put("/blogs/:id", requireAuth, updateBlog);
router.delete("/blogs/:id", requireAuth, requireSuperadmin, deleteBlog);

// Enforcement (Admin)
router.post("/enforcement", requireAuth, createEnforcement);
router.put("/enforcement/:id", requireAuth, updateEnforcement);
router.delete("/enforcement/:id", requireAuth, requireSuperadmin, deleteEnforcement);

// AWPII (Admin)
router.put("/awpii/:country", requireAuth, requireSuperadmin, updateAwpiiScore);

// Tracker (Admin)
router.put("/tracker/:country", requireAuth, requireSuperadmin, updateTrackerStatus);

export default router;
