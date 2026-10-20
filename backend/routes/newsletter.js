import express from 'express';
import {
  subscribe,
  addSubscriber,
  getSubscribers,
  getNewsletters,
  getNewsletterById,
  sendNewsletter,
  getCampaigns,
  createCampaign,
  trackOpen,
  trackClick,
  getNewsletterAnalytics
} from '../controllers/newsletterController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public newsletter & subscription endpoints
router.post('/subscribe', subscribe);
router.post('/subscribers', addSubscriber);
router.post('/newsletter/subscribe', subscribe);

// Newsletters Archive (Public)
router.get('/newsletters', getNewsletters);
router.get('/newsletters/:id', getNewsletterById);

// Public Open & Click Tracking endpoints
router.get('/track/open/:campaignId/:subscriberId', trackOpen);
router.get('/track/click/:campaignId/:subscriberId', trackClick);

// Protected Admin & Analytics endpoints
router.get('/subscribers', requireAuth, getSubscribers);
router.get('/admin/subscribers', requireAuth, getSubscribers);
router.post('/admin/newsletters/send', requireAuth, sendNewsletter);
router.get('/campaigns', requireAuth, getCampaigns);
router.post('/campaigns', requireAuth, createCampaign);
router.get('/analytics', requireAuth, getNewsletterAnalytics);

export default router;
