# ProposalChatbotBankJateng

Aplikasi chatbot Bank Jateng dengan arsitektur monorepo:

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Chat engine: backend memanggil server model eksternal dan ChromaDB untuk konteks

## Struktur Project

```text
.
├── backend/              # API Express, auth, chat, database, Docker Compose
├── frontend/             # Aplikasi React/Vite
├── text-generation-webui/ # Project terpisah, tidak wajib untuk menjalankan app utama
└── package.json          # Workspace root
```

## Prasyarat

- Node.js 20+ disarankan
- npm 9+ atau yang setara
- Docker Desktop, jika ingin menjalankan backend chat lengkap dengan ChromaDB
- PostgreSQL / Neon connection string untuk backend
- Server model AI yang kompatibel dengan endpoint chat backend

## Instalasi

Jalankan dari root repository:

```bash
npm install
```

Lalu siapkan file environment:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

## Konfigurasi Environment

### `backend/.env`

Isi minimal variabel berikut:

```env
DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require&channel_binding=require
JWT_SECRET=your_jwt_secret_here
MODEL_API_URL=http://host.docker.internal:11434/api/chat
MODEL_NAME=dolphin-llama3
```

Catatan:

- `DATABASE_URL` wajib untuk koneksi PostgreSQL / Neon.
- `MODEL_API_URL` dan `MODEL_NAME` dipakai oleh route chat.
- Untuk fitur chat yang memakai ChromaDB, backend paling aman dijalankan lewat Docker Compose agar service `chroma` tersedia.

### `frontend/.env.local`

Frontend sudah punya default proxy ke backend lokal, jadi file ini opsional. Jika ingin eksplisit, isi seperti ini:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Menjalankan Project

### Opsi yang disarankan: backend via Docker, frontend via Vite

1. Jalankan backend + ChromaDB dari folder `backend`:

```bash
cd backend
docker compose up --build
```

2. Di terminal lain, jalankan frontend dari root repository:

```bash
npm run dev --workspace=frontend
```

3. Buka aplikasi di:

```text
http://localhost:3000
```

Port yang dipakai:

- Frontend Vite: `3000`
- Backend Express: `5000`
- ChromaDB: `8000`

### Opsi development cepat

Jika kamu hanya ingin menjalankan frontend dan backend Node secara bersamaan:

```bash
npm run dev
```

Catatan: mode ini tetap membutuhkan konfigurasi backend yang benar, dan fitur chat akan bergantung pada server model serta ChromaDB yang bisa dijangkau dari backend.

## Command Penting

```bash
npm run dev                 # Jalankan frontend + backend workspace
npm run build               # Build frontend
npm run start               # Jalankan backend workspace
npm run dev --workspace=frontend
npm run dev --workspace=backend
```

## Build Production

1. Build frontend:

```bash
npm run build
```

2. Jalankan backend dalam mode production:

```bash
cd backend
NODE_ENV=production npm start
```

Backend akan menyajikan hasil build frontend dari `frontend/dist/public`.

## Troubleshooting

- Jika frontend tidak bisa akses API, pastikan backend berjalan di port `5000`.
- Jika chat error, cek apakah service ChromaDB aktif dan server model bisa diakses dari nilai `MODEL_API_URL`.
- Jika database gagal konek, periksa `DATABASE_URL` di `backend/.env`.
- Jika port `3000`, `5000`, atau `8000` sudah dipakai aplikasi lain, hentikan proses yang bentrok atau ubah port terkait.

## Catatan

- Folder `text-generation-webui/` adalah project terpisah dan tidak wajib untuk menjalankan aplikasi utama ini.
- File seperti model `.gguf`, cache Chroma, dan environment lokal sebaiknya tidak di-commit ke Git.
