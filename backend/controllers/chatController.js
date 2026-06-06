import pool from '../config/db.js';
import axios from 'axios';
import { ChromaClient } from 'chromadb';
import path from 'path';
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
            // include common generation params at top-level for broader compatibility
            temperature: 0.1,
            top_p: 0.1,
            stream: false,
            options: {
                temperature: 0.1,
                top_p: 0.1
            }
        };
        let botResponse = '';
        // If configured to use a mock model (for low-RAM devices), return a lightweight response.
        if (process.env.USE_MOCK_MODEL === 'true') {
            botResponse = generateMockResponse(message, contextData);
        } else {
            try {
                // Log outgoing model request for verification
                console.log('SEND TO MODEL:', MODEL_API_URL);
                console.log('MODEL_NAME:', MODEL_NAME);
                try { console.log('REQUEST PAYLOAD:', JSON.stringify(modelReqBody, null, 2)); } catch(e) {}

                const modelRes = await axios.post(MODEL_API_URL, modelReqBody, { timeout: 120000 });
                // Normalize response from different server implementations
                const d = modelRes.data;
                if (!d) botResponse = '';
                else if (d.choices && Array.isArray(d.choices) && d.choices.length > 0) {
                    const choice = d.choices[0];
                    if (choice.message && choice.message.content) botResponse = choice.message.content;
                    else if (choice.delta && choice.delta.content) botResponse = choice.delta.content;
                    else if (choice.text) botResponse = choice.text;
                } else if (d.message && d.message.content) botResponse = d.message.content;
                else if (d.generated_text) botResponse = d.generated_text;
                else if (d.reply) botResponse = d.reply;
                else {
                    const candidates = ['content', 'text', 'response'];
                    for (const k of candidates) {
                        if (d[k] && typeof d[k] === 'string') { botResponse = d[k]; break; }
                    }
                }

                if (!botResponse) botResponse = typeof d === 'string' ? d : JSON.stringify(d);

                // If model returned an empty response, and mocks are not enabled,
                // respond with a clear "not connected to GGUF" message instead of
                // silently falling back to a synthesized reply.
                if (!botResponse || String(botResponse).trim() === '' || botResponse === '{}' || botResponse === '[]') {
                    if (process.env.USE_MOCK_MODEL === 'true') {
                        botResponse = generateMockResponse(message, contextData);
                    } else {
                        const notConnectedMsg = 'Maaf, chatbot belum terhubung ke model GGUF. Silakan periksa server model atau file GGUF Anda.';
                        try {
                            await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'user', message]);
                            await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'assistant', notConnectedMsg]);
                        } catch (e) {
                            console.error('Gagal menyimpan log saat model memberikan respon kosong:', e.message);
                        }
                        return res.status(502).json({ reply: notConnectedMsg });
                    }
                }

                // Optional enforcement: check that the model server reports the same model identifier/path
                // Set ENFORCE_MODEL_PATH=true in backend/.env to enable strict checking.
                const enforce = process.env.ENFORCE_MODEL_PATH === 'true';
                if (enforce) {
                    // Try a few common fields where servers expose model id/name
                    const returnedModelId = d && (d.model || d.model_id || d.model_name || d.modelName || d.modelPath || (d.data && d.data.model));
                    if (returnedModelId) {
                        const expectedBase = path.basename(MODEL_NAME || '');
                        const returnedBase = String(returnedModelId);
                        if (!returnedBase.includes(expectedBase) && returnedBase !== MODEL_NAME) {
                            console.error('Model enforcement failed. Expected model:', MODEL_NAME, 'but server reported:', returnedModelId);
                            return res.status(502).json({ message: 'Model tidak sesuai pada server. Periksa konfigurasi MODEL_NAME di backend dan server model.' , expected: MODEL_NAME, reported: returnedModelId });
                        }
                        console.log('Model enforcement OK. Server reported model:', returnedModelId);
                    } else {
                        console.warn('ENFORCE_MODEL_PATH aktif tetapi server tidak melaporkan identifier model. Tidak dapat melakukan verifikasi otomatis.');
                    }
                }
            } catch (err) {
                console.error('Model API unreachable:', err.message);
                if (process.env.USE_MOCK_MODEL === 'true') {
                    botResponse = generateMockResponse(message, contextData);
                } else {
                    const notConnectedMsg = 'Maaf, chatbot belum terhubung ke model GGUF. Silakan periksa server model atau file GGUF Anda.';
                    try {
                        await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'user', message]);
                        await pool.query('INSERT INTO chat_logs (user_id, role, message) VALUES ($1, $2, $3)', [userId, 'assistant', notConnectedMsg]);
                    } catch (e) {
                        console.error('Gagal menyimpan log saat model tidak tersedia:', e.message);
                    }
                    return res.status(503).json({ reply: notConnectedMsg });
                }
            }
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

// Public endpoint for testing without authentication — returns mock responses only
export const sendMessagePublic = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

    try {
        // If mock mode is enabled, return the lightweight mock immediately.
        if (process.env.USE_MOCK_MODEL === 'true') {
            const botResponse = generateMockResponse(message, '');
            return res.json({ reply: botResponse });
        }

        // Otherwise try calling the configured model API directly.
        const MODEL_API_URL = process.env.MODEL_API_URL || 'http://127.0.0.1:11434/v1/chat/completions';
        const MODEL_NAME = process.env.MODEL_NAME || '';
        const modelReq = {
            model: MODEL_NAME,
            messages: [{ role: 'user', content: message }],
            temperature: 0.1,
            max_new_tokens: 200
        };

        try {
            const modelRes = await axios.post(MODEL_API_URL, modelReq, { timeout: 120000 });
            const d = modelRes.data;
            let botResponse = '';
            if (d) {
                if (d.choices && Array.isArray(d.choices) && d.choices.length > 0) {
                    const choice = d.choices[0];
                    if (choice.message && choice.message.content) botResponse = choice.message.content;
                    else if (choice.text) botResponse = choice.text;
                } else if (d.message && d.message.content) botResponse = d.message.content;
                else if (d.generated_text) botResponse = d.generated_text;
                else if (d.reply) botResponse = d.reply;
                else if (typeof d === 'string') botResponse = d;
            }

            if (!botResponse || String(botResponse).trim() === '') {
                return res.status(502).json({ reply: 'Maaf, chatbot belum terhubung ke model GGUF. Silakan periksa server model atau file GGUF Anda.' });
            }

            return res.json({ reply: botResponse });
        } catch (err) {
            console.error('sendMessagePublic: model API error:', err.message);
            return res.status(503).json({ reply: 'Maaf, chatbot belum terhubung ke model GGUF. Silakan periksa server model atau file GGUF Anda.' });
        }
    } catch (err) {
        console.error('sendMessagePublic error:', err.message);
        return res.status(500).json({ message: 'Terjadi kesalahan pada mock chat.' });
    }
};

/**
 * Lightweight mock response generator used when local model is unavailable.
 * It uses simple heuristics and available context to produce a safe reply
 * so the frontend and backend flow can be tested without a heavy model.
 */
const generateMockResponse = (userMessage, contextData) => {
    const msg = (userMessage || '').toLowerCase();

    // If context includes real-time balance data, surface it directly
    const balanceMatch = contextData && contextData.match(/KOSONG|\[DATA SALDO REAL-TIME ANDA\]: ([^\n]+)/i);
    if (contextData && contextData.includes('[DATA SALDO REAL-TIME ANDA]')) {
        // extract the balances block if available
        const idx = contextData.indexOf('[DATA SALDO REAL-TIME ANDA]');
        const snippet = contextData.slice(idx).split('\n').slice(0,2).join(' ');
        return `Berdasarkan data akun Anda: ${snippet}. Jika butuh detail lebih lanjut, buka dashboard Rekening.`;
    }

    // If RAG returned official info, link to it
    if (contextData && contextData.includes('[INFORMASI RESMI BANK JATENG]')) {
        const info = contextData.split('[INFORMASI RESMI BANK JATENG]:\n')[1] || '';
        const short = info.split('\n').slice(0,3).join(' ');
        return `Menurut referensi resmi: ${short} ... (sumber internal). Apakah Anda ingin saya jelaskan lebih lanjut?`;
    }

    // Basic intent heuristics
    if (msg.includes('saldo') || msg.includes('cek') || msg.includes('balance')) {
        return 'Untuk melihat saldo, buka Dashboard → Total Saldo. Jika Anda ingin, saya bisa memandu langkah transfer.';
    }
    if (msg.includes('transfer') || msg.includes('kirim uang')) {
        return 'Untuk transfer: pilih Transfer di dashboard, isi rekening tujuan, jumlah, lalu konfirmasi OTP.';
    }
    if (msg.includes('promo') || msg.includes('promosi')) {
        return 'Kami sedang ada promosi cashback hingga 100rb. Cek halaman Promosi di aplikasi atau tanyakan detailnya lagi.';
    }
    if (msg.includes('hubungi') || msg.includes('support') || msg.includes('bantuan')) {
        return 'Hubungi customer service: 1500-100 atau email support@bankjateng.co.id. Mau saya sambungkan ke info lainnya?';
    }

    // Default polite fallback
    return "Maaf, saya belum terhubung ke model cerdas saat ini. Namun berdasarkan data yang ada, saya bisa membantu langkah-langkah umum — sebutkan apa yang ingin Anda lakukan (cek saldo/transfer/promo).";
};