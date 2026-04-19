# WhisperBox — Panduan Deploy ke VPS

## Gambaran Arsitektur

```
Browser → Nginx (reverse proxy, SSL) → {
  /          → whisperbox (Vite SPA, static files)
  /api/*     → api-server (Express, port 8080)
}
```

---

## 1. Setup User (Jangan Pakai Root!)

Menjalankan aplikasi sebagai `root` berbahaya — kalau ada bug atau celah keamanan, penyerang langsung dapat akses penuh ke server. Gunakan user biasa dengan hak sudo.

**Jika VPS kamu hanya punya user `root`**, buat user baru dulu:

```bash
# Login sebagai root, lalu:
adduser deploy                        # buat user baru (ganti "deploy" jika mau)
usermod -aG sudo deploy               # beri hak sudo
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy  # copy SSH key agar bisa login
```

Setelah itu, **logout dari root** dan login ulang sebagai user baru:

```bash
ssh deploy@ip-server-kamu
```

> Semua perintah di panduan ini dijalankan sebagai user ini (bukan root).
> Perintah yang butuh akses sistem akan diawali `sudo`.

---

## 2. Prasyarat Server

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y curl git nginx certbot python3-certbot-nginx

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm
npm install -g pnpm

# PM2 (process manager)
npm install -g pm2

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib
```

---

## 3. Siapkan Database PostgreSQL

```bash
sudo -u postgres psql

-- Di dalam psql:
CREATE USER whisperbox WITH PASSWORD 'ganti_password_kuat';
CREATE DATABASE whisperbox OWNER whisperbox;
\q
```

Catat connection string:

```
postgresql://whisperbox:ganti_password_kuat@localhost:5432/whisperbox
```

---

## 4. Clone dan Install Dependensi

```bash
cd /var/www
git clone <url-repo-kamu> whisperbox
cd whisperbox
pnpm install
```

---

## 5. Konfigurasi Environment Variables

Buat file `/var/www/whisperbox/.env`:

```bash
cp .env.example .env   # jika ada, atau buat manual
nano /var/www/whisperbox/.env
```

Isi env vars (penjelasan tiap field ada di bagian 5):

```env
# ── WAJIB ──────────────────────────────────────────────────
NODE_ENV=production
DATABASE_URL=postgresql://whisperbox:ganti_password_kuat@localhost:5432/whisperbox
APP_URL=https://domainmu.com

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx

# Admin Panel
ADMIN_SECRET=buat_string_acak_panjang_minimal_32_karakter

# Session (untuk rate limiting berbasis IP)
SESSION_SECRET=buat_string_acak_lain_minimal_32_karakter

# ── PEMBAYARAN (TriPay) ─────────────────────────────────────
TRIPAY_API_KEY=api_key_production_dari_dashboard_tripay
TRIPAY_PRIVATE_KEY=private_key_production_dari_dashboard_tripay
TRIPAY_MERCHANT_CODE=kode_merchant_production
# Jangan set TRIPAY_SANDBOX atau set ke "false" agar pakai mode production

# ── EMAIL (Resend) ──────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@domainmu.com

# ── ANTI-SPAM (Cloudflare Turnstile) ───────────────────────
TURNSTILE_SECRET_KEY=secret_key_dari_cloudflare_turnstile

# ── OPSIONAL ───────────────────────────────────────────────
LOG_LEVEL=info
PREMIUM_PRICE=49900
```

> **Catatan Fitur Avatar (Foto Profil):**
> Fitur upload foto profil saat ini menggunakan Replit Object Storage yang tidak tersedia di VPS.
> Avatar yang sudah diupload di Replit tidak akan bisa diakses. Ada dua opsi:
>
> - **Opsi A (mudah):** Biarkan saja — fitur upload avatar tidak akan berfungsi, sisanya normal.
> - **Opsi B (perlu kode tambahan):** Ganti ke penyimpanan lokal atau S3/R2. Hubungi saya jika perlu panduan ini.

---

## 6. Penjelasan Tiap Environment Variable

| Variable                | Keterangan                                 | Dari mana                                                       |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `NODE_ENV`              | Wajib `production`                         | Set manual                                                      |
| `DATABASE_URL`          | Connection string PostgreSQL               | Dari langkah 2                                                  |
| `APP_URL`               | URL publik aplikasi (tanpa trailing slash) | Domain kamu                                                     |
| `CLERK_PUBLISHABLE_KEY` | Clerk auth — public key                    | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys       |
| `CLERK_SECRET_KEY`      | Clerk auth — secret key                    | Clerk Dashboard → API Keys                                      |
| `ADMIN_SECRET`          | Password akses halaman `/admin`            | Generate bebas                                                  |
| `SESSION_SECRET`        | Salt untuk hashing IP (rate limiting)      | Generate bebas                                                  |
| `TRIPAY_API_KEY`        | API key pembayaran                         | [TriPay Dashboard](https://tripay.co.id/member/merchant)        |
| `TRIPAY_PRIVATE_KEY`    | Private key signature TriPay               | TriPay Dashboard                                                |
| `TRIPAY_MERCHANT_CODE`  | Kode merchant TriPay                       | TriPay Dashboard                                                |
| `RESEND_API_KEY`        | API key email                              | [Resend Dashboard](https://resend.com)                          |
| `RESEND_FROM_EMAIL`     | Alamat pengirim email                      | Domain yang sudah diverifikasi di Resend                        |
| `TURNSTILE_SECRET_KEY`  | Verifikasi CAPTCHA server-side             | [Cloudflare Dashboard](https://dash.cloudflare.com) → Turnstile |

**Tidak dibutuhkan di VPS** (khusus Replit):

- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- `PRIVATE_OBJECT_DIR`
- `PUBLIC_OBJECT_SEARCH_PATHS`

---

## 7. Konfigurasi Clerk untuk Domain Custom

Di [Clerk Dashboard](https://dashboard.clerk.com):

1. Buka **Domains** → tambahkan `domainmu.com`
2. Verifikasi kepemilikan domain (tambahkan DNS record yang diminta)
3. Di **API Keys**, salin `pk_live_...` dan `sk_live_...` (bukan yang `pk_test_...`)

Untuk Clerk proxy (opsional tapi direkomendasikan untuk SEO):

```env
CLERK_PROXY_URL=https://domainmu.com/api/__clerk
```

---

## 8. Konfigurasi Cloudflare Turnstile

1. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com) → **Turnstile**
2. Tambahkan site baru → pilih **Managed** → masukkan domain
3. Salin **Site Key** → ini untuk `VITE_TURNSTILE_SITE_KEY` saat build
4. Salin **Secret Key** → ini untuk `TURNSTILE_SECRET_KEY` di env

---

## 9. Konfigurasi TriPay Production

1. Login ke [TriPay Dashboard](https://tripay.co.id/member/merchant)
2. Pastikan status merchant sudah **active** (bukan sandbox)
3. Di **Merchant** → salin API Key, Private Key, Kode Merchant
4. Daftarkan **Callback URL**: `https://domainmu.com/api/payments/callback`
5. Daftarkan **Return URL**: `https://domainmu.com/upgrade`

---

## 10. Build Aplikasi

```bash
cd /var/www/whisperbox

# Load env vars dulu untuk proses build
set -a && source .env && set +a

# Build frontend
# PORT dan BASE_PATH wajib diisi saat build (nilai PORT tidak penting untuk build, hanya untuk dev server)
# BASE_PATH=/ artinya aplikasi berjalan di root domain
PORT=3000 \
BASE_PATH=/ \
VITE_TURNSTILE_SITE_KEY=site_key_turnstile_kamu \
pnpm --filter @workspace/whisperbox run build

# Build API server
pnpm --filter @workspace/api-server run build
```

Output frontend akan ada di: `artifacts/whisperbox/dist/public/`

---

## 11. Jalankan Migrasi Database

```bash
cd /var/www/whisperbox
export $(cat .env | grep -v '^#' | xargs)
pnpm --filter @workspace/db run push
```

---

## 12. Jalankan dengan PM2

Buat file `ecosystem.config.js` di root proyek:

```javascript
module.exports = {
  apps: [
    {
      name: "whisperbox-api",
      script: "./artifacts/api-server/dist/index.mjs",
      cwd: "/var/www/whisperbox",
      env_file: ".env",
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
```

```bash
cd /var/www/whisperbox
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # ikuti instruksi yang muncul agar auto-start saat reboot
```

---

## 13. Konfigurasi Nginx

```bash
sudo nano /etc/nginx/sites-available/whisperbox
```

```nginx
server {
    listen 80;
    server_name domainmu.com www.domainmu.com;

    # Frontend (static files hasil build)
    root /var/www/whisperbox/artifacts/whisperbox/dist/public;
    index index.html;

    # API — proxy ke Express
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback — semua route dikembalikan ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/whisperbox /etc/nginx/sites-enabled/
sudo nginx -t   # cek tidak ada error
sudo systemctl reload nginx
```

---

## 14. SSL dengan Certbot

```bash
sudo certbot --nginx -d domainmu.com -d www.domainmu.com
```

Certbot akan otomatis mengubah config Nginx untuk HTTPS.

---

## 15. Verifikasi

Cek semua layanan berjalan:

```bash
pm2 status
sudo systemctl status nginx
sudo -u postgres psql -c "\l"
```

Test endpoint API:

```bash
curl https://domainmu.com/api/config
```

---

## Troubleshooting

**API tidak bisa diakses:**

```bash
pm2 logs whisperbox-api --lines 50
```

**Frontend tidak tampil / blank:**

```bash
# Pastikan build sudah ada
ls /var/www/whisperbox/artifacts/whisperbox/dist/index.html

# Cek Nginx error log
sudo tail -f /var/log/nginx/error.log
```

**Database error:**

```bash
# Test koneksi
psql $DATABASE_URL -c "SELECT 1"
```

**TriPay callback tidak masuk:**

- Pastikan `APP_URL` sudah benar dan HTTPS
- Cek URL callback di dashboard TriPay sudah terdaftar
- Cek PM2 logs untuk error saat menerima callback
