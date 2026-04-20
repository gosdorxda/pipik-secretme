#!/usr/bin/env bash
# ============================================================
# update.sh — Script update kepoin.me di VPS
# ============================================================
# Cara pakai:
#   ./update.sh                  Update penuh (frontend + backend)
#   ./update.sh --frontend-only  Hanya rebuild frontend (lebih cepat)
#   ./update.sh --skip-install   Skip pnpm install (hemat waktu)
#   ./update.sh --migrate        Jalankan migrasi database setelah build
#   ./update.sh --skip-install --migrate   Kombinasi flag
# ============================================================

set -euo pipefail

# ── Warna output ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

log_info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
log_ok()      { echo -e "${GREEN}[OK]${NC}    $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $*"; }
log_section() { echo -e "\n${BOLD}══ $* ══${NC}"; }

# ── Parse argumen ─────────────────────────────────────────────
FRONTEND_ONLY=false
SKIP_INSTALL=false
RUN_MIGRATE=false

for arg in "$@"; do
  case $arg in
    --frontend-only) FRONTEND_ONLY=true ;;
    --skip-install)  SKIP_INSTALL=true ;;
    --migrate)       RUN_MIGRATE=true ;;
    --help|-h)
      echo ""
      echo -e "${BOLD}update.sh${NC} — Script update kepoin.me di VPS"
      echo ""
      echo "Penggunaan:"
      echo "  ./update.sh                  Update penuh (frontend + backend)"
      echo "  ./update.sh --frontend-only  Hanya rebuild frontend"
      echo "  ./update.sh --skip-install   Skip pnpm install"
      echo "  ./update.sh --migrate        Jalankan migrasi DB setelah build"
      echo ""
      echo "Contoh kombinasi:"
      echo "  ./update.sh --skip-install --migrate"
      echo "  ./update.sh --frontend-only --skip-install"
      echo ""
      exit 0
      ;;
    *)
      log_error "Flag tidak dikenal: $arg"
      echo "Jalankan './update.sh --help' untuk melihat opsi yang tersedia."
      exit 1
      ;;
  esac
done

# ── Direktori kerja ───────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
log_info "Direktori: $(pwd)"

# ── Ringkasan mode ────────────────────────────────────────────
echo ""
echo -e "${BOLD}Mode update:${NC}"
echo "  Frontend only : $FRONTEND_ONLY"
echo "  Skip install  : $SKIP_INSTALL"
echo "  Migrasi DB    : $RUN_MIGRATE"
echo ""

# ── 1. Git pull ───────────────────────────────────────────────
log_section "1. Ambil kode terbaru"
if ! git pull; then
  log_error "git pull gagal. Cek koneksi atau ada konflik merge."
  exit 1
fi
log_ok "Kode berhasil diperbarui."

# ── 2. Install dependensi ─────────────────────────────────────
if [ "$SKIP_INSTALL" = false ]; then
  log_section "2. Install dependensi Node"
  pnpm install --frozen-lockfile
  log_ok "Dependensi ter-install."
else
  log_warn "Langkah 2 dilewati (--skip-install)."
fi

# ── 3. Load environment variables ────────────────────────────
log_section "3. Load environment variables"
if [ ! -f ".env" ]; then
  log_error "File .env tidak ditemukan di $(pwd)!"
  log_error "Buat file .env terlebih dahulu (lihat DEPLOY.md § 5)."
  exit 1
fi
set -a
# shellcheck disable=SC1091
source .env
set +a
log_ok "Environment variables ter-load."

# ── 4. Build ──────────────────────────────────────────────────
log_section "4. Build aplikasi"

if [ "$FRONTEND_ONLY" = true ]; then
  log_info "Hanya build frontend..."
  pnpm --filter @workspace/whisperbox build
  log_ok "Frontend berhasil di-build."
else
  log_info "Build frontend..."
  pnpm --filter @workspace/whisperbox build
  log_ok "Frontend selesai."

  log_info "Build API server..."
  pnpm --filter @workspace/api-server build
  log_ok "API server selesai."
fi

# ── 5. Migrasi database ───────────────────────────────────────
if [ "$RUN_MIGRATE" = true ]; then
  log_section "5. Migrasi database"
  log_info "Menjalankan migrasi schema..."
  pnpm --filter @workspace/db run push
  log_ok "Migrasi selesai."
else
  log_warn "Langkah 5 dilewati (--migrate tidak diberikan)."
  log_warn "Jika ada perubahan schema DB, jalankan ulang dengan flag --migrate."
fi

# ── 6. Restart PM2 ────────────────────────────────────────────
if [ "$FRONTEND_ONLY" = true ]; then
  log_section "6. Restart PM2"
  log_info "Mode frontend-only: PM2 tidak perlu di-restart."
  log_info "Nginx langsung melayani file baru dari dist/."
else
  log_section "6. Restart PM2 (reload env)"
  log_info "Menghentikan proses lama..."
  pm2 delete vooi-api 2>/dev/null || true

  log_info "Memuat ulang env vars ke shell..."
  set -a
  source .env
  set +a

  log_info "Menjalankan API server baru..."
  pm2 start ecosystem.config.js
  pm2 save
  log_ok "PM2 berhasil di-restart."
fi

# ── 7. Verifikasi ─────────────────────────────────────────────
log_section "7. Verifikasi"

if [ "$FRONTEND_ONLY" = false ]; then
  pm2 status
  echo ""
  log_info "Cek log API (10 baris terakhir):"
  pm2 logs vooi-api --lines 10 --nostream 2>/dev/null || true
fi

echo ""
log_ok "══════════════════════════════════════"
log_ok " Update selesai! 🎉"
log_ok "══════════════════════════════════════"

if [ "$FRONTEND_ONLY" = false ]; then
  echo ""
  echo "  Uji API   : curl https://kepoin.me/api/config"
  echo "  Lihat log : pm2 logs vooi-api"
fi
echo ""
