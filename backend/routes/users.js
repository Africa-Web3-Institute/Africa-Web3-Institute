import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
// Only superadmins can manage users
router.use(requireSuperadmin);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
