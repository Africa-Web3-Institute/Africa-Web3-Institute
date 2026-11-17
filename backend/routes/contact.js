import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage
} from '../controllers/contactController.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Public endpoint for submitting contact form
router.post('/contact', submitContactMessage);

// Protected admin endpoints for managing inbox messages
router.get('/contact-messages', requireAuth, requirePermission('messages.view'), getContactMessages);
router.put('/contact-messages/:id', requireAuth, requirePermission('messages.view'), updateMessageStatus);
router.delete('/contact-messages/:id', requireAuth, requirePermission('messages.delete'), deleteContactMessage);

export default router;
