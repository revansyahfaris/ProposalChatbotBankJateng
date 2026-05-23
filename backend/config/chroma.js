import { ChromaClient } from 'chromadb'; // Gunakan ChromaClient untuk koneksi lokal/server
import 'dotenv/config'; // Cara ringkas untuk load .env di ESM

const client = new ChromaClient({
    path: process.env.CHROMA_URL || 'http://localhost:8000/api/v2'
});

const COLLECTION_NAME = 'ai_memory';

const getCollection = async () => {
    try {
        // Mencoba mengambil koleksi yang sudah ada
        return await client.getCollection({
            name: COLLECTION_NAME
        });
    } catch (error) {
        // Jika tidak ada (error), maka buat baru
        console.log(`Membuat koleksi baru: ${COLLECTION_NAME}`);
        return await client.createCollection({
            name: COLLECTION_NAME
        });
    }
};

export default getCollection;