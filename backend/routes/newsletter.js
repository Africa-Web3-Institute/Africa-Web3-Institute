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
import { requireAuth, requirePermission } from '../middleware/auth.js';

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
router.get('/subscribers', requireAuth, requirePermission('newsletter.view'), getSubscribers);
router.get('/admin/subscribers', requireAuth, requirePermission('newsletter.view'), getSubscribers);
router.post('/admin/newsletters/send', requireAuth, requirePermission('newsletter.send'), sendNewsletter);
router.get('/campaigns', requireAuth, requirePermission('newsletter.view'), getCampaigns);
router.post('/campaigns', requireAuth, requirePermission('newsletter.send'), createCampaign);
router.get('/analytics', requireAuth, requirePermission('newsletter.view'), getNewsletterAnalytics);

export default router;
