import { Router } from 'express';
// Pastikan menyertakan ekstensi .js untuk file lokal
import { signup, login } from '../controllers/authController.js';

const router = Router();

// Endpoint untuk registrasi user baru
router.post('/signup', signup);

// Endpoint untuk login user
router.post('/login', login);

export default router;