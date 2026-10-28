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
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

// Public dashboard & intelligence routes
router.get('/dashboard', getContinentalDashboard);
router.get('/metrics', getEcosystemMetrics);
router.get('/adoption', getAdoptionIndicators);
router.get('/startups', getStartups);

// Protected admin management routes
router.post('/metrics', requireAuth, createEcosystemMetric);
router.post('/startups', requireAuth, createStartup);
router.put('/startups/:id', requireAuth, updateStartup);
router.delete('/startups/:id', requireAuth, requireSuperadmin, deleteStartup);

export default router;
