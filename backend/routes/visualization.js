import express from 'express';
import {
  getVisualizations,
  getVisualizationBySlug,
  createVisualization,
  updateVisualization,
  deleteVisualization
} from '../controllers/visualizationController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes for fetching visualization library & specs
router.get('/', getVisualizations);
router.get('/:slug', getVisualizationBySlug);

// Protected routes for editing and managing visualizations
router.post('/', requireAuth, createVisualization);
router.put('/:id', requireAuth, updateVisualization);
router.delete('/:id', requireAuth, requireSuperadmin, deleteVisualization);

export default router;
