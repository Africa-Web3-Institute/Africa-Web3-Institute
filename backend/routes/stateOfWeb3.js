import express from 'express';
import {
  getEcosystemMetrics,
  createEcosystemMetric,
  getAdoptionIndicators,
  getStartups,
  createStartup,
  updateStartup,
  deleteStartup,
  getContinentalDashboard
} from '../controllers/stateOfWeb3Controller.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Public dashboard & intelligence routes
router.get('/dashboard', getContinentalDashboard);
router.get('/metrics', getEcosystemMetrics);
router.get('/adoption', getAdoptionIndicators);
router.get('/startups', getStartups);

// Protected admin management routes
router.post('/metrics', requireAuth, requirePermission('content.create'), createEcosystemMetric);
router.post('/startups', requireAuth, requirePermission('content.create'), createStartup);
router.put('/startups/:id', requireAuth, requirePermission('content.edit'), updateStartup);
router.delete('/startups/:id', requireAuth, requirePermission('content.delete'), deleteStartup);

export default router;
