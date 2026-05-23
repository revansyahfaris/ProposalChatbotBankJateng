import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './config/db.js'; // Pastikan pakai .js

// Import Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// Cek Koneksi Database menggunakan async/await agar lebih modern
const checkConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Koneksi ke Neon berhasil! ✅ Jam Server:', res.rows[0].now);
  } catch (err) {
    console.error('Koneksi ke Neon gagal ❌', err.message);
  }
};
checkConnection();

// Endpoint Percobaan
app.get('/', (req, res) => {
  res.send('Server Bank Jateng sudah jalan!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});