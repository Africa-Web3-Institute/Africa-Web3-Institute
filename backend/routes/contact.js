import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage
} from '../controllers/contactController.js';
import { requireAuth, requireSuperadmin } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint for submitting contact form
router.post('/contact', submitContactMessage);

// Protected admin endpoints for managing inbox messages
router.get('/contact-messages', requireAuth, getContactMessages);
router.put('/contact-messages/:id', requireAuth, updateMessageStatus);
router.delete('/contact-messages/:id', requireAuth, requireSuperadmin, deleteContactMessage);

export default router;
