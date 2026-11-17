import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);
router.use(requirePermission('users.manage')); // superadmins and admins (admins can't touch superadmin accounts)

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
