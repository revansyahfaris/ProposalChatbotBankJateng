import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    console.log("Data masuk: ", req.body);
    const { full_name, username, email, password, identity_number } = req.body;
    
    // Mengambil client dari pool untuk transaksi (BEGIN/COMMIT)
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        // 1. Cek apakah user sudah ada
        const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Simpan ke database (Tabel Users)
        const newUser = await client.query(
            'INSERT INTO users (full_name, username, email, password, identity_number, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [full_name, username, email, hashedPassword, identity_number, 'user']
        );
        const userId = newUser.rows[0].id;

        // 4. Simpan ke tabel User Profiles
        await client.query(
            'INSERT INTO user_profiles (user_id, full_name, identity_number) VALUES ($1, $2, $3)',
            [userId, full_name, identity_number]
        );

        await client.query('COMMIT'); 

        res.status(201).json({
            message: 'User berhasil didaftarkan!',
            user: { id: userId, full_name, username, email, identity_number }
        });

    } catch (err) {
        await client.query('ROLLBACK'); 
        console.error(err.message);
        res.status(500).send('Gagal Signup');
    } finally {
        client.release(); 
    }
};

export const login = async (req, res) => {
    console.log("Data masuk: ", req.body);
    const { email, password } = req.body;

    try {
        // 1. Cek apakah user ada di database
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }

        // 2. Cek apakah password benar
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email atau password salah' });
        }

        // 3. Buat JWT Token
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Kirim token ke Frontend
        res.json({
            token,
            user: { 
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email,          // <-- Tambahkan ini
                full_name: user.rows[0].full_name,  // <-- Tambahkan ini
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error saat login');
    }
};