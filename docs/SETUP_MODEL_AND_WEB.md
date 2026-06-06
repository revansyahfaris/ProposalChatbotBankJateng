# Panduan: Menjalankan Web App dan Memasang Model GGUF

Panduan ini menjelaskan langkah-langkah praktis untuk:
- Menjalankan frontend & backend aplikasi (development / production)
- Menyebarkan dan memuat model GGUF (text-generation-webui / Ollama)
- Konfigurasi agar backend dapat memanggil model API

Target pembaca: pengembang yang akan men-deploy model di mesin/VM/GPU yang lebih kuat.

---

## Prasyarat (di mesin target)

1. Sistem operasi: macOS (Apple Silicon) atau Linux (x86_64/ARM)
2. Python 3.10+ (direkomendasikan via Miniforge/Conda)
3. Git, curl, unzip
4. Node.js 20+ dan npm (untuk frontend/backend jika dijalankan di host yang sama)
5. Ruang disk untuk model (file GGUF) — ukuran model tergantung file (beberapa GB)
6. Hardware rekomendasi:
   - Eksperimental (M1/M2): M1 Pro/Max dengan 16GB+ lebih stabil
   - Produksi: GPU dengan >= 24 GB VRAM (contoh: RTX 4090, A10, A100)

---
## 1) Menyiapkan folder dan model

1. Salin file GGUF (contoh: `Qwen2.5-7B-Instruct.Q4_K_M.gguf`) ke folder di mesin model, mis. `/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf`.

   Contoh via `scp` dari mesin lokal:

   ```bash
   scp /path/to/Qwen2.5-7B-Instruct.Q4_K_M.gguf user@model-host:/opt/models/
   ssh user@model-host
   ls -lh /opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
   ```

2. Pastikan permission dan owner benar:

   ```bash
   sudo chown $USER:$USER /opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
   chmod 644 /opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf

---

## 2) Menjalankan text-generation-webui (contoh umum)


1. Clone atau pindah ke folder `text-generation-webui` di mesin model:

   ```bash
   git clone https://github.com/oobabooga/text-generation-webui.git
   cd text-generation-webui
   ```


   ```bash
   ./start_macos.sh --model "/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf" --api --api-port 11434 --gpu mps
   ```

   Atau (jika menjalankan server.py langsung):
   ```bash
   # aktifkan conda env yang sudah dibuat oleh installer
   conda activate /path/to/installer_files/env
   python3 server.py --model "/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf" --api --api-port 11434 --device mps

   - `--api` mengaktifkan API OpenAI-compatible endpoint.
   - `--api-port 11434` contoh port; pilih port yang tidak bentrok.

3. Tunggu sampai log menunjukkan API sudah siap. Cari baris: `API listening` / `Serving on` / `Running on http://...`.

4. Tes endpoint sederhana dari mesin itu (atau dari backend host jika reachable):

   ```bash
   curl -s -X POST http://localhost:11434/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{"model":"/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf","messages":[{"role":"system","content":"You are concise."},{"role":"user","content":"Halo"}] }' | jq
   ```

   - Jika mendapatkan JSON berisi teks (mis. `choices[0].message.content` atau `message.content`) berarti server model siap.

## 2.1) Cara instalasi model — langkah lengkap (contoh macOS)

Langkah berikut memastikan model GGUF Anda diunduh, terpasang, dan web UI/API berjalan sehingga backend bisa memanggilnya.

1) Install Miniforge (direkomendasikan untuk Apple Silicon / macOS):

```bash
# download dan install Miniforge (ikuti petunjuk installer)
curl -LO https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-arm64.sh
bash Miniforge3-MacOSX-arm64.sh
source ~/.bashrc # atau source ~/.zshrc sesuai shell
```

2) Clone atau gunakan folder `text-generation-webui` yang sudah ada:

```bash
cd ~/Projects
git clone https://github.com/oobabooga/text-generation-webui.git
cd text-generation-webui
```

3) Siapkan environment dan virtualenv (installer biasanya membuat `.venv`):

```bash
# jalankan skrip installer bila ada
./install.sh || true
# atau manual
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

4) Tempatkan file GGUF di lokasi yang bisa diakses, contoh `/opt/models/` atau di root project:

```bash
mkdir -p /opt/models
cp /path/ke/Qwen2.5-7B-Instruct.Q4_K_M.gguf /opt/models/
sudo chown $USER:$USER /opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
chmod 644 /opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
```

5) Jalankan web UI / API dengan model GGUF (contoh, macOS MPS):

```bash
source .venv/bin/activate
./start_macos.sh --model "/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf" --api --api-port 11434 --gpu mps
```

Catatan opsi yang sering berguna:
- `--api` : aktifkan endpoint OpenAI-compatible (`/v1/chat/completions`).
- `--api-port` : port API (11434 umum dipakai di repo ini).
- `--device mps` atau `--gpu mps` : gunakan MPS (Apple Silicon). Gunakan `--device cuda` di mesin Linux/CUDA.

6) Di UI (http://127.0.0.1:7861) cek `Parameters`:
- `max_new_tokens`: naikkan bila respons terpotong (mis. 200-512).
- `auto_max_new_tokens`: aktifkan supaya memanfaatkan konteks penuh.
- `Activate text streaming`: aktifkan bila ingin streaming.
- `Add the bos_token to the beginning of prompts`: beberapa loader perlu token BOS.

7) Verifikasi API dari terminal (coba beberapa format):

Chat completions (chat format):
```bash
curl -s -X POST http://127.0.0.1:11434/v1/chat/completions \
   -H "Content-Type: application/json" \
   -d '{"model":"/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf","messages":[{"role":"system","content":"You are concise."},{"role":"user","content":"Siap?"}],"max_new_tokens":80}' | jq
```

Completions (single input/instruction style, beberapa webui pakai endpoint ini):
```bash
curl -s -X POST http://127.0.0.1:11434/v1/completions \
   -H "Content-Type: application/json" \
   -d '{"model":"/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf","input":"### Instruction:\nJika kamu model ini, jawab singkat: siap\n### Response:","max_new_tokens":80}' | jq
```

Jika salah satu dari panggilan di atas mengembalikan text di `choices[0].message.content` atau di `generated_text`, berarti model sudah benar‑benar menghasilkan teks.

8) Jika respons kosong (choices tanpa content):
- Naikkan `max_new_tokens` dan `temperature` sedikit (contoh: 0.2).
- Coba ubah format prompt: tambahkan `system` message atau gunakan instruction template di UI.
- Aktifkan `auto_max_new_tokens` dan `Activate text streaming` di UI.
- Periksa log webui untuk error internal (stacktrace) atau peringatan loader.

9) Setelah model respons sudah OK, pastikan `backend/.env` mengarahkan ke API yang sama (`MODEL_API_URL`) dan `MODEL_NAME` memakai nama/path yang sama, lalu restart backend.

```bash
# contoh nilai .env
MODEL_API_URL=http://127.0.0.1:11434/v1/chat/completions
MODEL_NAME=/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
USE_MOCK_MODEL=false
ENFORCE_MODEL_PATH=true

# restart backend (nodemon)
cd /path/to/backend
rs
```

10) Lakukan tes end‑to‑end via backend (POST `/api/chat/public` atau `/api/chat` dengan token). Jika backend masih mengembalikan "belum terhubung", periksa kembali bahwa panggilan API yang diuji di langkah (7) memang mengembalikan teks.

---

---

## 3) Konfigurasi backend agar terhubung ke model

1. Edit file `backend/.env` (di mesin yang menjalankan backend) dan set:

   ```env
   MODEL_API_URL=http://<MODEL_HOST>:11434/v1/chat/completions
   MODEL_NAME=/opt/models/Qwen2.5-7B-Instruct.Q4_K_M.gguf
   USE_MOCK_MODEL=false
   PORT=5050
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=postgresql://...
   CHROMA_URL=http://localhost:8000
   ```

   - Jika backend dan model berada pada mesin yang sama, gunakan `localhost`.
   - Jika beda host, gunakan alamat IP atau hostname dari model host.

2. Restart backend (di folder `backend`):

   ```bash
   npm install
   npm run dev   # atau restart nodemon dengan rs
   ```

3. Periksa log backend: ketika backend memanggil model, kamu akan melihat request keluar dan (jika error) pesan timeout atau koneksi.

---

## 4) Menjalankan frontend

1. Pastikan `frontend/.env` menunjuk ke backend yang benar:

   ```env
   VITE_API_BASE_URL=http://<BACKEND_HOST>:5050/api
   ```

2. Jalankan frontend di mesin pengembang atau server statis:

   ```bash
   cd frontend
   npm install
   npm run dev       # development
   npm run build     # production build
   npm run preview   # preview build
   ```

3. Buka `http://localhost:3000` (atau host yang disediakan vite preview) dan masuk sebagai user untuk menguji chat.

---

## 5) Verifikasi end-to-end (ringkas)

1. Pastikan model API merespon (lihat langkah di atas).
2. Pastikan backend `USE_MOCK_MODEL=false` dan sudah direstart.
3. Login ke aplikasi (atau gunakan curl untuk login), dapatkan token.
4. Panggil endpoint chat backend:

   ```bash
   curl -s -X POST http://<BACKEND_HOST>:5050/api/chat \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"message":"Jelaskan poin penting dari training data"}' | jq
   ```

5. Hasil `reply` harus berisi teks yang dikembalikan model. Jika masih mock muncul fallback message.

---

## 6) Tips & Troubleshooting cepat

 Jika model gagal dimuat (OOM):
   - Coba gunakan model 3B quantized atau pindah ke mesin dengan lebih banyak memori.
   - Gunakan swap/fast NVMe hanya sebagai cadangan (sangat lambat untuk inferensi).
 Jika backend timeout: naikkan timeout axios di `backend/controllers/chatController.js` (saat ini 120s).
 Jika tidak ada konteks RAG: pastikan ChromaDB berjalan dan koleksi berisi data; periksa `CHROMA_URL`.
 Jika endpoint model tidak reachable: cek firewall, pastikan port terbuka dan `MODEL_API_URL` benar.

 ## 7) Panduan untuk macOS dan Windows (WSL2)

 ### macOS
 1. Pastikan Anda memiliki Homebrew terinstal. Jika belum, jalankan:
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
 2. Instal Python dan Git menggunakan Homebrew:
    ```bash
    brew install python git
    ```

 ### Windows (WSL2)
 1. Pastikan Anda telah menginstal WSL2. Jika belum, ikuti petunjuk di [dokumentasi resmi Microsoft](https://docs.microsoft.com/en-us/windows/wsl/install).
 2. Setelah WSL2 terinstal, buka terminal WSL dan jalankan:
    ```bash
    sudo apt update
    sudo apt install python3 git
    ```
 3. Ikuti langkah-langkah yang sama seperti di macOS untuk mengatur model.

---

