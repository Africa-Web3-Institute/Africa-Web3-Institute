import express from 'express';
import {
  getSubscribers,
  addSubscriber,
  getCampaigns,
  createCampaign,
  trackOpen,
  trackClick,
  getNewsletterAnalytics
} from '../controllers/newsletterController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public subscription endpoint
router.post('/subscribe', addSubscriber);
router.post('/subscribers', addSubscriber);

// Public Open & Click Tracking endpoints
router.get('/track/open/:campaignId/:subscriberId', trackOpen);
router.get('/track/click/:campaignId/:subscriberId', trackClick);

// Protected Admin & Analytics endpoints
router.get('/subscribers', requireAuth, getSubscribers);
router.get('/campaigns', requireAuth, getCampaigns);
router.post('/campaigns', requireAuth, createCampaign);
router.get('/analytics', requireAuth, getNewsletterAnalytics);

export default router;
