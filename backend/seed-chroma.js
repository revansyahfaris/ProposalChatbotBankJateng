import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

// Pastikan pakai localhost:8000 kalau jalanin dari CMD Windows
const client = new ChromaClient({ 
    host: "chroma", // Pakai "chroma" karena dijalankan via docker exec
    port: 8000 
});
const embedder = new DefaultEmbeddingFunction();

async function seed() {
  try {
    console.log("🚀 Memulai proses pengisian data ChromaDB...");
    
    // 1. Ambil atau Buat Koleksi dengan Embedder yang sama dengan Backend
    const collection = await client.getOrCreateCollection({
      name: "test_bank_jateng",
      embeddingFunction: embedder
    });

    // 2. Siapkan 10 Data Referensi (Knowledge Base)
    const dataBank = [
      { id: "limit_silver", doc: "Limit tarik tunai harian kartu ATM Silver Bank Jateng adalah Rp 5.000.000 per hari." },
      { id: "limit_gold", doc: "Limit tarik tunai harian kartu ATM Gold Bank Jateng adalah Rp 10.000.000 per hari." },
      { id: "bunga_kur", doc: "Bunga Kredit Usaha Rakyat (KUR) Bank Jateng tahun 2026 adalah 6% per tahun untuk pinjaman mikro." },
      { id: "jam_operasional", doc: "Jam operasional kantor cabang Bank Jateng adalah Senin-Jumat pukul 08:00 sampai 15:30 WIB." },
      { id: "info_mbanking", doc: "Cara aktivasi Mobile Banking Bank Jateng (Bima Mobile) harus dilakukan melalui mesin ATM atau datang ke kantor cabang terdekat." },
      { id: "setoran_awal", doc: "Setoran awal pembukaan rekening Tabungan Bima Bank Jateng minimal Rp 50.000." },
      { id: "biaya_admin", doc: "Biaya administrasi bulanan kartu ATM Silver Bank Jateng adalah Rp 5.000." },
      { id: "kontak_pusat", doc: "Layanan call center resmi Bank Jateng (Bima Care) dapat dihubungi di nomor 1500365." },
      { id: "syarat_kredit", doc: "Syarat pengajuan kredit pegawai adalah fotokopi KTP, KK, Slip Gaji 3 bulan terakhir, dan SK Pegawai asli." },
      { id: "lokasi_pusat", doc: "Kantor Pusat Bank Jateng beralamat di Jl. Pemuda No. 142, Kota Semarang, Jawa Tengah." }
    ];

    // 3. Masukkan data
    await collection.add({
      ids: dataBank.map(item => item.id),
      documents: dataBank.map(item => item.doc),
    });

    console.log("✅ Berhasil memasukkan 10 data pengetahuan baru!");

    // 4. Test Query Singkat
    console.log("🔍 Mengetes Query...");
    const testQuery = await collection.query({
      queryTexts: ["Berapa bunga pinjaman KUR?"],
      nResults: 1,
    });

    console.log("📄 Hasil test query:", testQuery.documents[0]);
    
  } catch (error) {
    console.error("❌ Gagal menjalankan seed:", error.message);
  }
}

seed();