import express from 'express';
import {
  getSettings,
  updateSettings
} from '../controllers/settingsController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
// Only superadmins can manage settings
router.use(requireSuperadmin);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
