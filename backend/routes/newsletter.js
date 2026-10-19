import express from "express";
import {
  subscribe,
  getNewsletters,
  getNewsletterById,
  getSubscribers,
  sendNewsletter
} from "../controllers/newsletterController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public newsletter endpoints
router.post("/subscribe", subscribe);
router.post("/newsletter/subscribe", subscribe);
router.get("/newsletters", getNewsletters);
router.get("/newsletters/:id", getNewsletterById);

// Admin protected endpoints
router.get("/admin/subscribers", requireAuth, getSubscribers);
router.post("/admin/newsletters/send", requireAuth, sendNewsletter);

export default router;
