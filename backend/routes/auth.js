import express from 'express';
import { login, me, myActivity, changeOwnPassword, updateProfile, permissionCatalog, systemStatus } from '../controllers/authController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/me/password', requireAuth, changeOwnPassword);
router.put('/me/profile', requireAuth, updateProfile);
router.get('/me/activity', requireAuth, myActivity);
router.get('/permissions', requireAuth, permissionCatalog);
router.get('/system', requireAuth, requireSuperadmin, systemStatus);

export default router;
