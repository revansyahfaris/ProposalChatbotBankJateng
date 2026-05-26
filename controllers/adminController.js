import pool from '../config/db.js';

export const getAdminDashboard = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id AS user_id,
                up.full_name,
                u.email,
                up.identity_number,
                COUNT(ba.id) AS jumlah_rekening,
                COALESCE(SUM(ba.balance), 0) AS total_saldo
            FROM users u
            JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN bank_accounts ba ON up.id = ba.profile_id
            WHERE u.role = 'user'
            GROUP BY u.id, up.full_name, up.identity_number
            ORDER BY up.full_name ASC
        `;

        const result = await pool.query(query);
        
        res.json({
            status: "Success",
            total_nasabah: result.rowCount,
            data_nasabah: result.rows
        });
    } catch (err) {
        console.error('Admin Error:', err.message);
        res.status(500).json({ message: 'Server Error Admin' });
    }
};