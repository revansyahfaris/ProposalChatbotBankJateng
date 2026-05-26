import { Router } from 'express';
// Jangan lupa tambahkan ekstensi .js jika mengimpor file lokal
import { saveMemory, searchMemory } from '../controllers/memoryController.js';

const router = Router();

// Endpoint untuk menambah memori
router.post('/add', saveMemory);

// Endpoint untuk mencari memori
router.post('/search', searchMemory);

export default router;