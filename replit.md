# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm run codegen:check` — verify generated files match the current OpenAPI spec (fails if out of sync; also runs as part of `pnpm run build`)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## WhisperBox App Features

### Database Schema

- **users**: id, clerkId, username, displayName, bio, avatarUrl, `isPremium`, `defaultPublicMessages`, `emailNotifications`, `linkOpens`, `socialInstagram`, `socialTiktok`, `socialX`, `socialFacebook`, `socialGithub`, `socialLinkedin`, createdAt, updatedAt
- **messages**: id, recipientId, content, isRead, `isPublic`, `ownerReply`, `ownerRepliedAt`, createdAt

### API Endpoints

- `GET /api/users/me` — current user profile (includes isPremium, linkOpens)
- `PUT /api/users/me` — update profile
- `GET /api/users/:username` — public profile + public messages (increments linkOpens)
- `GET /api/messages` — list messages (returns isPublic, ownerReply, ownerRepliedAt)
- `GET /api/messages/stats/me` — totalMessages, unreadMessages, unrepliedMessages, linkOpens, isPremium
- `POST /api/messages/:username` — send anonymous message
- `POST /api/messages/:id/reply` — owner replies to a message
- `PATCH /api/messages/:id/visibility` — toggle message public/private
- `DELETE /api/messages/:id` — delete message

### Admin Panel (`/admin`)

- Auth: ADMIN_SECRET env var + sessionStorage key "wb_admin_secret" + x-admin-secret header
- 4 tabs: Overview (stats), Pengguna, Transaksi, Pengaturan
- Settings backed by `system_settings` table; cache TTL 60s via `settingsCache.ts`; invalidated on PUT /admin/settings
- IP ban system: stored as JSON array in `banned_ips` setting; `ipBanMiddleware` runs on all requests; managed via `/admin/ip-bans` CRUD routes
- Tripay mode indicator: reads `IS_SANDBOX` flag from env (TRIPAY_SANDBOX=true overrides NODE_ENV)
- `link_opens_points_per_1000` setting: configures points earned per 1000 profile views

### Reply Notification Email

- Pengirim bisa opsional masukkan email saat kirim pesan (jika pemilik profil aktifkan `allowReplyNotif`)
- `senderEmail` disimpan langsung tanpa verifikasi Turnstile (Turnstile dihapus karena tidak kompatibel dengan iframe)
- Saat pemilik balas pesan, `sendReplyNotification` di `email.ts` otomatis kirim email ke pengirim
- UI: collapsible section di public-profile.tsx dengan link "Mau dapat notifikasi jika [Nama] membalas?"

### Halaman Pendukung (Static Pages)

- `/tentang` — Tentang WhisperBox (misi, cerita, nilai, stats)
- `/cara-pakai` — Panduan penggunaan langkah demi langkah
- `/faq` — FAQ accordion dengan 4 kategori (Umum, Privasi, Fitur, Premium)
- `/privasi` — Kebijakan Privasi
- `/ketentuan` — Syarat & Ketentuan
- Semua halaman pakai `StaticPageLayout` (`src/components/static-page-layout.tsx`) dengan header + footer konsisten

### Object Storage (Upload Foto Profil & Logo Admin)

- Driver dideteksi otomatis via `STORAGE_DRIVER` env var:
  - `replit` (default): Replit Object Storage sidecar (GCS-backed, hanya di Replit)
  - `s3`: S3-compatible storage — Cloudflare R2, MinIO, AWS S3, dll.
- Implementation: `artifacts/api-server/src/lib/objectStorage.ts` — satu class `ObjectStorageService` yang mendukung kedua driver
- Route upload: `POST /api/storage/uploads/request-url` (user avatar) + `POST /api/admin/upload-url` (logo/favicon admin)
- Route serve: `GET /api/storage/objects/*` — proxy atau redirect (302) ke `STORAGE_PUBLIC_URL` jika di-set

**S3 env vars yang dibutuhkan (STORAGE_DRIVER=s3):**

```
S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
STORAGE_PUBLIC_URL  # optional tapi direkomendasikan (redirect vs proxy)
```

- ACL untuk mode S3: semua object dianggap public (akses write dikontrol di endpoint API)
- ACL untuk mode Replit: disimpan di GCS object metadata (`objectAcl.ts`)
- Panduan lengkap deploy R2: lihat `DEPLOY.md` seksi 6b

### Codegen

- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Drift check: `pnpm run codegen:check` (runs orval then `git status --porcelain` on generated dirs; catches modified and new untracked files; also runs automatically via `pnpm run build`)
- **Convention**: whenever `openapi.yaml` or DB schema changes, run codegen and commit the updated generated files in the same task/PR
- api-zod index exports only `./generated/api` (not api.schemas — zod mode doesn't split)
