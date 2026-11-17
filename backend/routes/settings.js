import express from 'express';
import {
  getSettings,
  updateSettings
} from '../controllers/settingsController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
// Superadmins, plus any account given the "Manage settings" permission
router.use(requirePermission('settings.manage'));

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
