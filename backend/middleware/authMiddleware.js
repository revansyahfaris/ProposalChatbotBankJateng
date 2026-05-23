import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ambil token dari format "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: 'Akses ditolak, token hilang' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token tidak valid' });
        req.user = user; // Simpan data user (id & role) ke request
        next(); // Lanjut ke fungsi berikutnya
    });
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak! Khusus Admin.' });
    }
    next();
};