# vooi.lol — Panduan Deploy ke VPS

## Gambaran Arsitektur

```
Browser → Nginx (reverse proxy, SSL termination)
              ├── /api/*  → Express API (PM2, port 8080)
              └── /*      → Static files (hasil Vite build)
```

Kode sumber ada di satu repo monorepo. Dua artifact yang berjalan di VPS:

| Artifact | Lokasi | Deskripsi |
|---|---|---|
| `@workspace/whisperbox` | `artifacts/whisperbox/` | Frontend React + Vite |
| `@workspace/api-server` | `artifacts/api-server/` | Backend Express + Drizzle |

---

## 1. Setup User (Jangan Pakai Root!)

Menjalankan aplikasi sebagai `root` berbahaya. Gunakan user biasa dengan hak sudo.

**Buat user `deploy` jika belum ada:**

```bash
# Login sebagai root, lalu:
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Setelah itu, logout dari root dan login ulang sebagai user `deploy`:

```bash
ssh deploy@ip-vps-kamu
```

> Semua perintah di panduan ini dijalankan sebagai user ini. Perintah yang butuh akses sistem diawali `sudo`.

---

## 2. Install Dependensi Sistem

```bash
sudo apt update && sudo apt upgrade -y

# Tool dasar
sudo apt install -y curl git nginx certbot python3-certbot-nginx

# Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi
node -v   # harus v20.x.x
npm -v

# pnpm
npm install -g pnpm
pnpm -v

# PM2 (process manager)
npm install -g pm2
pm2 -v

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

## 3. Siapkan Database PostgreSQL

```bash
sudo -u postgres psql
```

Di dalam psql, jalankan:

```sql
CREATE USER vooi WITH PASSWORD 'ganti_dengan_password_kuat_unik';
CREATE DATABASE vooi OWNER vooi;
\q
```

Catat connection string untuk dipakai di `.env`:

```
postgresql://vooi:ganti_dengan_password_kuat_unik@localhost:5432/vooi
```

> **Tips:** Generate password kuat dengan `openssl rand -base64 32`

---

## 4. Clone Repo dan Install Dependensi Node

```bash
cd /var/www
sudo mkdir vooi
sudo chown deploy:deploy vooi
git clone <url-repo-kamu> vooi
cd vooi
pnpm install
```

---

## 5. Konfigurasi Environment Variables

Buat file `.env` di root proyek:

```bash
nano /var/www/vooi/.env
```

Salin template berikut dan isi semua nilainya:

```env
# ── WAJIB ──────────────────────────────────────────────────────

NODE_ENV=production
DATABASE_URL=postgresql://vooi:ganti_dengan_password_kuat_unik@localhost:5432/vooi
APP_URL=https://vooi.lol

# Clerk Authentication (gunakan production keys: pk_live_ dan sk_live_)
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxx

# Admin Panel — string acak panjang minimal 32 karakter
ADMIN_SECRET=isi_string_acak_minimal_32_karakter_disini

# Salt untuk hashing IP (rate limiting) — string acak berbeda dari ADMIN_SECRET
SESSION_SECRET=isi_string_acak_lain_minimal_32_karakter

# ── PEMBAYARAN (TriPay) ─────────────────────────────────────────

TRIPAY_API_KEY=api_key_dari_dashboard_tripay
TRIPAY_PRIVATE_KEY=private_key_dari_dashboard_tripay
TRIPAY_MERCHANT_CODE=kode_merchant_tripay
# Hapus baris ini atau set ke false untuk mode production:
# TRIPAY_SANDBOX=true

# ── EMAIL (Resend) ──────────────────────────────────────────────

RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
# Harus berupa alamat email lengkap dengan domain yang sudah diverifikasi di Resend:
RESEND_FROM_EMAIL=noreply@vooi.lol

# ── OPSIONAL ────────────────────────────────────────────────────

LOG_LEVEL=info
PREMIUM_PRICE=49900
```

Amankan file `.env` agar tidak bisa dibaca user lain:

```bash
chmod 600 /var/www/vooi/.env
```

> **Catatan Avatar:** Fitur upload foto profil menggunakan Replit Object Storage yang tidak tersedia di VPS. Avatar tidak akan berfungsi — sisanya normal. Hubungi developer jika butuh panduan S3/R2.

---

## 6. Penjelasan Tiap Environment Variable

| Variable | Keterangan | Dari mana |
|---|---|---|
| `NODE_ENV` | Wajib `production` | Set manual |
| `DATABASE_URL` | Connection string PostgreSQL | Langkah 3 |
| `APP_URL` | URL publik tanpa trailing slash | Domain kamu |
| `CLERK_PUBLISHABLE_KEY` | Clerk auth — public key | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | Clerk auth — secret key | Clerk Dashboard → API Keys |
| `ADMIN_SECRET` | Password akses `/admin` | Generate bebas |
| `SESSION_SECRET` | Salt hashing IP untuk rate limiter | Generate bebas |
| `TRIPAY_API_KEY` | API key pembayaran | [TriPay Dashboard](https://tripay.co.id/member/merchant) |
| `TRIPAY_PRIVATE_KEY` | Private key signature TriPay | TriPay Dashboard |
| `TRIPAY_MERCHANT_CODE` | Kode merchant TriPay | TriPay Dashboard |
| `RESEND_API_KEY` | API key email | [Resend Dashboard](https://resend.com) |
| `RESEND_FROM_EMAIL` | Alamat pengirim email | Domain terverifikasi di Resend |

**Tidak dibutuhkan di VPS** (khusus Replit):
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- `PRIVATE_OBJECT_DIR`
- `PUBLIC_OBJECT_SEARCH_PATHS`
- `BASE_PATH` (default otomatis `/`)

---

## 7. Setup Clerk untuk Domain vooi.lol

1. Masuk ke [Clerk Dashboard](https://dashboard.clerk.com)
2. Buka **Domains** → klik **Add domain** → masukkan `vooi.lol`
3. Ikuti langkah verifikasi DNS yang diminta (biasanya CNAME record)
4. Setelah terverifikasi, buka **API Keys** → salin `pk_live_...` dan `sk_live_...`
5. Masukkan ke `.env` sebagai `CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY`

> Gunakan production keys (`pk_live_` / `sk_live_`), bukan development keys (`pk_test_`).

**Opsional — Clerk Proxy** (mencegah ad-blocker memblokir auth):

```env
CLERK_PROXY_URL=https://vooi.lol/api/__clerk
```

---

## 8. Setup Resend untuk Email vooi.lol

Email notifikasi (pesan masuk & notifikasi balasan) dikirim via Resend.

1. Masuk ke [Resend Dashboard](https://resend.com)
2. Buka **Domains** → **Add Domain** → masukkan `vooi.lol`
3. Tambahkan DNS records yang diminta (SPF, DKIM, DMARC) di DNS provider kamu
4. Tunggu hingga status domain **Verified** (bisa 5–30 menit)
5. Buka **API Keys** → **Create API Key** → salin ke `RESEND_API_KEY`
6. Set `RESEND_FROM_EMAIL=noreply@vooi.lol` (harus format `xxx@vooi.lol`, bukan domain saja)

> **Penting:** `RESEND_FROM_EMAIL` wajib berupa alamat email lengkap, bukan hanya domain. Contoh benar: `noreply@vooi.lol`. Jika salah, email tidak akan terkirim.

---

## 9. Setup TriPay Production

1. Login ke [TriPay Dashboard](https://tripay.co.id/member/merchant)
2. Pastikan status merchant sudah **Active** (bukan sandbox)
3. Salin: **API Key**, **Private Key**, **Kode Merchant**
4. Daftarkan **Callback URL**: `https://vooi.lol/api/payments/callback`
5. Daftarkan **Return URL**: `https://vooi.lol/upgrade`

---

## 10. Build Aplikasi

Sebelum build, env vars wajib ter-load ke shell:

```bash
cd /var/www/vooi
set -a && source .env && set +a

# Build frontend (Vite)
pnpm --filter @workspace/whisperbox build

# Build API server (esbuild)
pnpm --filter @workspace/api-server build
```

> **Kenapa `set -a && source .env && set +a`?**
> Ini men-export semua variabel dari `.env` ke environment shell saat ini.
> `CLERK_PUBLISHABLE_KEY` perlu di-inject ke bundle frontend saat build.
> Tanpa ini, Clerk tidak akan berfungsi di production.

Output frontend: `artifacts/whisperbox/dist/public/`
Output API: `artifacts/api-server/dist/index.mjs`

---

## 11. Jalankan Migrasi Database

Perintah ini membuat semua tabel yang dibutuhkan berdasarkan schema Drizzle:

```bash
cd /var/www/vooi
set -a && source .env && set +a
pnpm --filter @workspace/db run push
```

> Jalankan ini juga setiap kali ada perubahan schema database setelah update kode.

---

## 12. Setup PM2 (Process Manager)

Buat file `ecosystem.config.js` di root proyek:

```bash
nano /var/www/vooi/ecosystem.config.js
```

Isi dengan:

```javascript
module.exports = {
  apps: [
    {
      name: "vooi-api",
      script: "./artifacts/api-server/dist/index.mjs",
      cwd: "/var/www/vooi",
      env_file: ".env",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
    },
  ],
};
```

Jalankan PM2:

```bash
cd /var/www/vooi

# Load env dulu agar PM2 membacanya saat startup
set -a && source .env && set +a

pm2 start ecosystem.config.js
pm2 save
pm2 startup   # jalankan perintah yang muncul agar auto-start saat reboot
```

Cek status:

```bash
pm2 status
pm2 logs vooi-api --lines 20
```

---

## 13. Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/vooi
```

Isi dengan:

```nginx
server {
    listen 80;
    server_name vooi.lol www.vooi.lol;

    # Keamanan dasar
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # Frontend — static files hasil build Vite
    root /var/www/vooi/artifacts/whisperbox/dist/public;
    index index.html;

    # API — proxy ke Express (port 8080)
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
    }

    # SPA fallback — semua route dikembalikan ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Jangan serve file tersembunyi (.env, .git, dll)
    location ~ /\. {
        deny all;
    }
}
```

Aktifkan dan test:

```bash
sudo ln -s /etc/nginx/sites-available/vooi /etc/nginx/sites-enabled/
sudo nginx -t        # harus: "syntax is ok" dan "test is successful"
sudo systemctl reload nginx
```

---

## 14. SSL dengan Certbot (HTTPS)

```bash
sudo certbot --nginx -d vooi.lol -d www.vooi.lol
```

Certbot akan otomatis memodifikasi konfigurasi Nginx untuk HTTPS dan mengatur auto-renewal.

Verifikasi auto-renewal berjalan:

```bash
sudo certbot renew --dry-run
```

---

## 15. Verifikasi Instalasi

Cek semua layanan berjalan:

```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

Test API:

```bash
curl https://vooi.lol/api/config
# Harusnya mengembalikan JSON konfigurasi
```

Test database:

```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## 16. Update Aplikasi (Setelah Ada Perubahan Kode)

Setiap kali ada update dari repo, jalankan perintah berikut secara berurutan:

```bash
cd /var/www/vooi

# 1. Ambil kode terbaru
git pull

# 2. Update dependensi (jika ada perubahan package.json)
pnpm install

# 3. Load env vars ke shell
set -a && source .env && set +a

# 4. Build ulang frontend dan API server
pnpm --filter @workspace/whisperbox build
pnpm --filter @workspace/api-server build

# 5. Restart API server dengan env terbaru
#    (pm2 restart saja tidak reload .env — harus delete + start ulang)
pm2 delete vooi-api
set -a && source .env && set +a
pm2 start ecosystem.config.js
pm2 save

# 6. Cek status
pm2 status
pm2 logs vooi-api --lines 10
```

> **Kenapa tidak cukup `pm2 restart`?**
> `pm2 restart` tidak me-reload file `.env`. Jika ada perubahan env vars,
> harus `pm2 delete` + `source .env` + `pm2 start` untuk memastikan
> env vars terbaru terbaca oleh proses baru.

**Jika ada perubahan schema database**, tambahkan setelah build:

```bash
pnpm --filter @workspace/db run push
```

---

## Troubleshooting

### API tidak bisa diakses

```bash
# Cek apakah PM2 berjalan
pm2 status
pm2 logs vooi-api --lines 50

# Cek apakah port 8080 aktif
ss -tlnp | grep 8080

# Test langsung tanpa Nginx
curl http://localhost:8080/api/config
```

### Frontend blank / halaman putih

```bash
# Pastikan build sudah ada
ls /var/www/vooi/artifacts/whisperbox/dist/public/index.html

# Cek Nginx error
sudo tail -f /var/log/nginx/error.log

# Cek konfigurasi Nginx
sudo nginx -t
```

### Error "PORT environment variable is required"

Ini terjadi jika PM2 tidak membaca `.env`. Solusi:

```bash
pm2 delete vooi-api
set -a && source .env && set +a
pm2 start ecosystem.config.js
pm2 save
```

### PM2 tidak otomatis start setelah reboot

```bash
pm2 startup
# Jalankan perintah yang dicetak (biasanya sudo env PATH=... pm2 startup ...)
pm2 save
```

### Database error / tidak bisa konek

```bash
# Test koneksi manual
psql $DATABASE_URL -c "SELECT 1"

# Cek PostgreSQL berjalan
sudo systemctl status postgresql

# Cek user dan database ada
sudo -u postgres psql -c "\du"
sudo -u postgres psql -c "\l"
```

### Email tidak terkirim (Resend)

Cek beberapa hal:
1. `RESEND_FROM_EMAIL` harus format `noreply@vooi.lol`, bukan hanya `vooi.lol`
2. Domain `vooi.lol` harus sudah **Verified** di Resend Dashboard
3. DNS records (SPF, DKIM) sudah ditambahkan dengan benar

```bash
# Cek env sudah ter-load dengan benar
pm2 env vooi-api | grep RESEND
```

### Clerk auth tidak berfungsi / 401

```bash
# Pastikan menggunakan production keys (pk_live_, sk_live_)
pm2 env vooi-api | grep CLERK

# Domain vooi.lol harus sudah ditambahkan dan diverifikasi di Clerk Dashboard
```

### TriPay callback tidak masuk

1. Pastikan `APP_URL=https://vooi.lol` (bukan http, tidak ada trailing slash)
2. Callback URL di dashboard TriPay: `https://vooi.lol/api/payments/callback`
3. Cek PM2 logs saat transaksi berlangsung:

```bash
pm2 logs vooi-api --lines 100
```

---

## Referensi Cepat — Perintah yang Sering Dipakai

```bash
# Lihat log API real-time
pm2 logs vooi-api

# Restart API (tanpa reload env)
pm2 restart vooi-api

# Reload env + restart lengkap
pm2 delete vooi-api && set -a && source /var/www/vooi/.env && set +a && pm2 start /var/www/vooi/ecosystem.config.js && pm2 save

# Reload Nginx (setelah ubah config)
sudo nginx -t && sudo systemctl reload nginx

# Perpanjang SSL manual
sudo certbot renew

# Backup database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Cek ukuran database
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size('vooi'));"
```
