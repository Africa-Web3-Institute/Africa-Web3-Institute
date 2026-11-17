import express from 'express';
import { login, me, myActivity, changeOwnPassword, permissionCatalog } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', requireAuth, me);
router.put('/me/password', requireAuth, changeOwnPassword);
router.get('/me/activity', requireAuth, myActivity);
router.get('/permissions', requireAuth, permissionCatalog);

export default router;
