# CineList — Watchlist App

Aplikasi web untuk menyimpan daftar film dan series yang ingin ditonton. Dibuat dengan Node.js + Express (backend), Vue 3 (frontend), dan Firebase Realtime Database (database).

---


## Cara Menjalankan Lokal (Laragon)

### 1. Siapkan Database

- Buka **phpMyAdmin** di Laragon
- Buat database baru bernama `watchlist_db`
- Import file `backend/database.sql` (klik Import di phpMyAdmin)

### 2. Setup Backend

```bash
cd backend

# Copy .env
cp .env.example .env
# Edit .env sesuai config Laragon kamu (biasanya DB_PASSWORD kosong)

# Install dependencies
npm install

# Jalankan
npm run dev
```

Backend berjalan di: `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend

# Copy .env
cp .env.example .env
# Isi VITE_API_URL=http://localhost:3000/api

# Install dependencies
npm install

# Jalankan
npm run dev
```

Frontend berjalan di: `http://localhost:5173`

---

## Hosting

### Backend → Railway

1. Buat akun di [railway.app](https://railway.app)
2. Klik **New Project → Deploy from GitHub**
3. Upload/push folder `backend` ke GitHub dulu
4. Di Railway, set **root directory** ke `backend`
5. Tambahkan **MySQL** service di Railway (klik + Add Service → MySQL)
6. Set Environment Variables dari Railway dashboard:
   ```
   DB_HOST=...     (dari Railway MySQL)
   DB_PORT=...
   DB_USER=...
   DB_PASSWORD=...
   DB_NAME=...
   JWT_SECRET=rahasia_panjang_susah_ditebak
   PORT=3000
   ```
7. Jalankan `database.sql` di MySQL Railway (pakai TablePlus atau DBeaver)
8. Deploy! Railway akan otomatis deteksi `npm start`

### Frontend → Vercel

1. Buat akun di [vercel.com](https://vercel.com)
2. Import project dari GitHub (folder `frontend`)
3. Set **Environment Variables** di Vercel:
   ```
   VITE_API_URL=https://url-backend-railway-kamu.up.railway.app/api
   ```
4. Deploy!

---

## Cara Kerja Auth

1. User **register** → password di-hash pakai `bcryptjs`
2. User **login** → server validasi password, kirim **JWT token**
3. Frontend simpan token di `localStorage`
4. Setiap request ke `/api/films` → frontend kirim token di header:
   ```
   Authorization: Bearer <token>
   ```
5. Middleware backend verifikasi token sebelum proses request

---

## Contoh Request API (untuk laporan)

### Register
```json
POST /api/auth/register
{
  "name": "Budi",
  "email": "budi@email.com",
  "password": "rahasia123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "budi@email.com",
  "password": "rahasia123"
}
// Response: { token: "eyJ...", user: {...} }
```

### Tambah Film (pakai token)
```json
POST /api/films
Headers: { Authorization: "Bearer eyJ..." }
{
  "title": "Interstellar",
  "type": "Film",
  "genre": "Sci-Fi",
  "platform": "Netflix",
  "status": "Belum Ditonton",
  "poster_url": "https://...",
  "rating": 9
}
```
