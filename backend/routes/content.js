import express from 'express';
import {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getEnforcements,
  createEnforcement,
  updateEnforcement,
  deleteEnforcement,
  getAwpiiScores,
  updateAwpiiScore,
  getTrackerStatus,
  updateTrackerStatus
} from '../controllers/contentController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAuth to all routes in this file
router.use(requireAuth);

// Publications
router.get('/publications', getPublications);
router.post('/publications', createPublication);
router.put('/publications/:id', updatePublication);
router.delete('/publications/:id', requireSuperadmin, deletePublication); // Example: Only Superadmin can delete

// Enforcement
router.get('/enforcement', getEnforcements);
router.post('/enforcement', createEnforcement);
router.put('/enforcement/:id', updateEnforcement);
router.delete('/enforcement/:id', requireSuperadmin, deleteEnforcement);

// AWPII Scores
router.get('/awpii', getAwpiiScores);
router.put('/awpii/:country', requireSuperadmin, updateAwpiiScore);

// Tracker Status
router.get('/tracker', getTrackerStatus);
router.put('/tracker/:country', requireSuperadmin, updateTrackerStatus);

export default router;
