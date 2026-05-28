import pool from '../config/db.js';
import axios from 'axios';
import { ChromaClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';

const client = new ChromaClient({ host: "chroma", port: 8000 });
const embedder = new DefaultEmbeddingFunction();

export const sendMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

    try {
        // 1. Ambil History Chat (Maksimal 5)
        const historyRes = await pool.query(
            'SELECT role, message FROM chat_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5', 
            [userId]
        );
        const chatHistory = historyRes.rows.reverse().map(chat => ({ 
            role: chat.role, 
            content: chat.message 
        }));

        // 2. Kumpulkan Konteks (Dinamis & Statis)
        let contextData = "";

        // RAG Dinamis: Cek Saldo/Rekening
        const triggerWords = ['saldo', 'rekening', 'duit', 'tabungan'];
        if (triggerWords.some(word => message.toLowerCase().includes(word))) {
            const accountRes = await pool.query(
                `SELECT account_number, balance FROM bank_accounts ba 
                 JOIN user_profiles up ON ba.profile_id = up.id 
                 WHERE up.user_id = $1`, [userId]
            );
            if (accountRes.rows.length > 0) {
                const accounts = accountRes.rows.map(acc => `No. Rek: ${acc.account_number}, Saldo: Rp${acc.balance}`).join('; ');
                contextData += `\n[DATA SALDO REAL-TIME ANDA]: ${accounts}`;
            }
        }

        // RAG Statis: Informasi Bank dari ChromaDB
        try {
            const collection = await client.getCollection({ 
                name: "test_bank_jateng", 
                embeddingFunction: embedder 
            });
            const chromaRes = await collection.query({
                queryTexts: [message],
                nResults: 3,
            });
            
            if (chromaRes.documents[0].length > 0) {
                contextData += `\n[INFORMASI RESMI BANK JATENG]:\n${chromaRes.documents[0].join('\n')}`;
            }
        } catch (chromaErr) {
            console.log("LOG: ChromaDB tidak menemukan data atau error:", chromaErr.message);
        }

        // 3. Susun Pesan untuk AI (Dolphin-Llama3)
        // Kita pakai teknik "Instruction Sandwich"
        const messagesForAI = [
            { 
                role: "system", 
                content: "Kamu adalah Asisten Virtual Bank Jateng. Jawablah HANYA berdasarkan DATA REFERENSI yang diberikan. DILARANG KERAS menggunakan pengetahuan di luar teks tersebut. Jika data tidak ada, katakan Anda tidak tahu." 
            },
            ...chatHistory, // Riwayat obrolan sebelumnya
            { 
                role: "user", 
                content: `Gunakan data ini untuk menjawab pertanyaan saya:
                ---
                DATA REFERENSI:
                ${contextData || "Tidak ada data spesifik ditemukan."}
                ---
                PERTANYAAN SAYA:
                ${message}` 
            }
        ];

        console.log("--- DEBUG KONTEKS ---");
        console.log(contextData || "KOSONG");
        console.log("---------------------");

        // 4. Panggil server model eksternal (configurable via env)
        // Atur MODEL_API_URL dan MODEL_NAME di backend/.env jika ingin pakai server lokal lain
        const MODEL_API_URL = process.env.MODEL_API_URL || 'http://host.docker.internal:11434/api/chat';
        const MODEL_NAME = process.env.MODEL_NAME || 'dolphin-llama3';

        const modelReqBody = {
            model: MODEL_NAME,
            messages: messagesForAI,
            stream: false,
            options: {
                temperature: 0.1,
                top_p: 0.1
            }
        };

        const modelRes = await axios.post(MODEL_API_URL, modelReqBody, { timeout: 120000 });

        // Beberapa server (Ollama) merespon di `data.message.content`, sementara lain
        // mungkin langsung mengembalikan `data`. Kita ambil respons yang tersedia.
        let botResponse = '';
        if (modelRes.data) {
            if (modelRes.data.message && modelRes.data.message.content) botResponse = modelRes.data.message.content;
            else if (typeof modelRes.data === 'string') botResponse = modelRes.data;
            else if (modelRes.data.generated_text) botResponse = modelRes.data.generated_text;
            else botResponse = JSON.stringify(modelRes.data);
        }

        // 5. Simpan Log Chat (User & Assistant)
        await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'user', message]);
        await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'assistant', botResponse]);

        res.json({ reply: botResponse });

    } catch (error) {
        console.error("ERROR DETAIL:", error.message);
        res.status(500).json({ message: "Maaf, terjadi gangguan teknis.", detail: error.message });
    }
};