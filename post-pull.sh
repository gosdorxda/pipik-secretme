#!/usr/bin/env bash
# ============================================================
# post-pull.sh — Jalankan setelah git pull dari GitHub
# ============================================================
# Cara pakai:
#   ./post-pull.sh              Build frontend + backend + restart PM2
#   ./post-pull.sh --fe         Hanya rebuild frontend (lebih cepat)
#   ./post-pull.sh --migrate    Jalankan migrasi DB sebelum restart
# ============================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✔${NC}  $*"; }
info() { echo -e "${BLUE}▸${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
err()  { echo -e "${RED}✖${NC}  $*"; }
sep()  { echo -e "\n${BOLD}── $* ──────────────────────────────${NC}"; }

FRONTEND_ONLY=false
RUN_MIGRATE=false

for arg in "$@"; do
  case $arg in
    --fe|--frontend-only) FRONTEND_ONLY=true ;;
    --migrate)            RUN_MIGRATE=true ;;
    --help|-h)
      echo ""
      echo -e "${BOLD}post-pull.sh${NC} — Jalankan setelah git pull"
      echo ""
      echo "  ./post-pull.sh              Build semua + restart PM2"
      echo "  ./post-pull.sh --fe         Hanya frontend (lebih cepat)"
      echo "  ./post-pull.sh --migrate    Termasuk migrasi database"
      echo ""
      exit 0 ;;
    *)
      err "Flag tidak dikenal: $arg  (coba --help)"
      exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${BOLD}post-pull.sh${NC}  |  mode: $([ "$FRONTEND_ONLY" = true ] && echo 'frontend only' || echo 'full')$([ "$RUN_MIGRATE" = true ] && echo ' + migrate' || echo '')"
echo ""

# ── 1. Cek .env ───────────────────────────────────────────
sep "1. Environment"
if [ ! -f ".env" ]; then
  err "File .env tidak ditemukan!"
  err "Buat .env terlebih dahulu (lihat DEPLOY.md § 5)."
  exit 1
fi
set -a; source .env; set +a
ok ".env dimuat."

# ── 2. Install dependensi ─────────────────────────────────
sep "2. Dependensi"
info "Menginstall paket Node..."
pnpm install --frozen-lockfile
ok "Dependensi OK."

# ── 3. Migrasi database ───────────────────────────────────
if [ "$RUN_MIGRATE" = true ]; then
  sep "3. Migrasi database"
  info "Menjalankan migrasi schema..."
  pnpm --filter @workspace/db run push
  ok "Migrasi selesai."
else
  warn "Migrasi dilewati (tambahkan --migrate jika ada perubahan schema)."
fi

# ── 4. Build ──────────────────────────────────────────────
sep "4. Build"
info "Build frontend..."
pnpm --filter @workspace/whisperbox build
ok "Frontend selesai."

if [ "$FRONTEND_ONLY" = false ]; then
  info "Build API server..."
  pnpm --filter @workspace/api-server build
  ok "API server selesai."
fi

# ── 5. Restart PM2 ────────────────────────────────────────
sep "5. Restart"
if [ "$FRONTEND_ONLY" = true ]; then
  info "Mode frontend-only: PM2 tidak perlu restart."
  info "Nginx langsung melayani file baru dari dist/."
else
  info "Menghentikan proses lama..."
  pm2 delete vooi-api 2>/dev/null || true

  set -a; source .env; set +a

  info "Memulai API server baru..."
  pm2 start ecosystem.config.js
  pm2 save
  ok "PM2 berjalan."
fi

# ── Selesai ───────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  Selesai! Deploy berhasil 🚀${NC}"
echo -e "${BOLD}${GREEN}════════════════════════════════════${NC}"
echo ""
if [ "$FRONTEND_ONLY" = false ]; then
  echo "  Status PM2 : pm2 status"
  echo "  Log API    : pm2 logs vooi-api"
  echo "  Uji API    : curl https://vooi.lol/api/config"
fi
echo ""
