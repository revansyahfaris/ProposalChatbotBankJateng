import { Router } from 'express';

import { sendMessage, sendMessagePublic } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticateToken, sendMessage);
// Public test endpoint (no auth) — uses mock responses only
router.post('/public', sendMessagePublic);

export default router;