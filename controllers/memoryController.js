import getCollection from '../config/chroma.js';
import { v4 as uuidv4 } from 'uuid';

export const saveMemory = async (request, response) => {
  try {
    const { userId, message, category } = request.body;
    
    if (!userId || !message) {
      return response.status(400).json({ error: 'userId dan message wajib diisi' });
    }

    const memoryId = uuidv4();
    const collection = await getCollection();

    await collection.add({
      ids: [memoryId],
      documents: [message],
      metadatas: [{
        userId,
        category: category || 'general',
        createdAt: new Date().toISOString()
      }]
    });

    response.json({
      success: true,
      memoryId,
      message: 'Memory berhasil disimpan'
    });

  } catch (error) {
    response.status(500).json({
      error: 'Gagal menyimpan memory',
      details: error.message
    });
  }
};

export const searchMemory = async (request, response) => {
  try {
    const { userId, query } = request.body;

    if (!userId || !query) {
      return response.status(400).json({
        error: 'userId dan query wajib diisi'
      });
    }

    const collection = await getCollection();

    const results = await collection.query({
      queryTexts: [query],
      nResults: 5,
      where: { userId } // Mencari hanya memori milik user tersebut
    });

    response.json({
      success: true,
      // ChromaDB mengembalikan array di dalam array [[doc1, doc2]]
      // Kita ambil index [0] agar hasilnya flat array [doc1, doc2]
      memories: results.documents[0] || [],
      metadata: results.metadatas[0] || []
    });

  } catch (error) {
    response.status(500).json({
      error: 'Gagal mencari memory',
      details: error.message
    });
  }
};