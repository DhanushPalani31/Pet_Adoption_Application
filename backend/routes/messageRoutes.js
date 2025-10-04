import express from 'express';
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/conversations')
  .get(protect, getConversations)
  .post(protect, createConversation);

router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/messages', protect, sendMessage);

export default router;
