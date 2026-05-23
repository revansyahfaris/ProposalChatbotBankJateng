import { ChromaClient } from 'chromadb';

const client = new ChromaClient({ path: "http://localhost:8000" });

async function peek() {
    try {
        const collection = await client.getCollection({ name: "test_bank_jateng" });
        const results = await collection.get();
        
        console.log("=== ISI DATABASE CHROMADB ===");
        results.documents.forEach((doc, i) => {
            console.log(`Data ke-${i+1}: ${doc}`);
        });
    } catch (error) {
        console.error("Gagal mengintip data:", error.message);
    }
}

peek();