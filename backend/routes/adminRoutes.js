import { Router } from 'express';
// Pastikan menambahkan ekstensi .js untuk file lokal
import { getAdminDashboard } from '../controllers/adminController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Endpoint khusus Admin - Melewati dua layer pengecekan (Login & Role Admin)
router.get('/dashboard', authenticateToken, isAdmin, getAdminDashboard);

export default router;