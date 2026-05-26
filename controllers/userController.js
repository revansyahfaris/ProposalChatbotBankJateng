import pool from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.username,
                u.email,
                up.full_name,
                up.identity_number
            FROM users u
            JOIN user_profiles up ON u.id = up.user_id
            WHERE u.id = $1
        `;
        
        const accounts = await pool.query(query, [req.user.id]);
        res.json(accounts.rows);
    } catch (err) {
        console.error('Profile Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getDashboard = async (req, res) => {
    try {
        // Ambil profil dan semua nomor rekening milik user yang sedang login
        const query = `
            SELECT 
                up.full_name,
                ba.account_type, 
                ba.account_number,
                ba.balance
            FROM user_profiles up
            LEFT JOIN bank_accounts ba ON up.id = ba.profile_id
            WHERE up.user_id = $1
        `;
        
        const result = await pool.query(query, [req.user.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profil atau Rekening tidak ditemukan' });
        }

        const fullName = result.rows[0].full_name;

        // Logic check: Jika nasabah belum punya rekening (null), kirim array kosong
        const daftarRekening = result.rows[0].account_number === null 
            ? [] 
            : result.rows.map(row => ({
                account_number: row.account_number,
                account_type: row.account_type,
                balance: row.balance
            }));

        res.json({
            nasabah: fullName,
            daftar_rekening: daftarRekening
        });

    } catch (err) {
        console.error('Dashboard Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createAccount = async (req, res) => {
    const { account_type, initial_balance } = req.body;

    if (!account_type || initial_balance === undefined) {
        return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    try {
        // 1. Ambil profile_id milik user yang login
        const profile = await pool.query(
            'SELECT id FROM user_profiles WHERE user_id = $1',
            [req.user.id]
        );

        if (profile.rows.length === 0) {
            return res.status(404).json({ message: 'Profil tidak ditemukan' });
        }

        const profileId = profile.rows[0].id;

        // 2. Generate nomor rekening unik (10 digit)
        const accountNumber = String(Date.now()).slice(-10);

        // 3. Simpan ke database
        const newAccount = await pool.query(
            `INSERT INTO bank_accounts (profile_id, account_number, account_type, balance)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [profileId, accountNumber, account_type, initial_balance]
        );

        res.status(201).json({
            message: 'Rekening berhasil dibuat',
            account: newAccount.rows[0]
        });

    } catch (err) {
        console.error('Create Account Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};