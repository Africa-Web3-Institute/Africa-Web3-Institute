import express from 'express';
import {
  trackDownload,
  getCitations,
  addCitation,
  deleteCitation,
  getResearchImpactDashboard
} from '../controllers/researchMetricsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Download tracking trigger route (attached under /api/publications/:id/download)
router.get('/publications/:id/download', trackDownload);

// Research Impact & Citations routes (under /api/research-metrics)
router.get('/citations', getCitations);
router.get('/impact', getResearchImpactDashboard);

// Protected admin routes
router.post('/citations', requireAuth, requirePermission('content.create'), addCitation);
router.delete('/citations/:id', requireAuth, requirePermission('content.delete'), deleteCitation);

export default router;
