import { Router } from 'express';
import { getProfile, getDashboard, createAccount } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint untuk mengambil profil user
router.get('/profile', authenticateToken, getProfile);

// Endpoint untuk data dashboard
router.get('/dashboard', authenticateToken, getDashboard);

router.post('/accounts', authenticateToken, createAccount);

export default router;