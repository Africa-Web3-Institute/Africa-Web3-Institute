import express from 'express';
import {
  getVisualizations,
  getVisualizationBySlug,
  createVisualization,
  updateVisualization,
  deleteVisualization
} from '../controllers/visualizationController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Public routes for fetching visualization library & specs
router.get('/', getVisualizations);
router.get('/:slug', getVisualizationBySlug);

// Protected routes for editing and managing visualizations
router.post('/', requireAuth, requirePermission('content.create'), createVisualization);
router.put('/:id', requireAuth, requirePermission('content.edit'), updateVisualization);
router.delete('/:id', requireAuth, requirePermission('content.delete'), deleteVisualization);

export default router;
