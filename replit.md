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

### Cloudflare Turnstile (anti-bot untuk email notif balasan)
- **Frontend**: `VITE_TURNSTILE_SITE_KEY` env var (default: test key `1x00000000000000000000AA`)
- **Backend**: `TURNSTILE_SECRET_KEY` env var (default: test key `1x0000000000000000000000000000000AA`)
- Test keys selalu pass verifikasi tanpa akun Cloudflare; untuk production, daftar di dash.cloudflare.com → Turnstile → add site
- Verifikasi terjadi di `messages.ts` sebelum menyimpan `senderEmail`; jika gagal, pesan tetap dikirim tanpa email
- UI: collapsible section dengan toggle link "Mau dapat notifikasi jika [Nama] membalas? →"

### Codegen
- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Drift check: `pnpm run codegen:check` (runs orval then `git status --porcelain` on generated dirs; catches modified and new untracked files; also runs automatically via `pnpm run build`)
- **Convention**: whenever `openapi.yaml` or DB schema changes, run codegen and commit the updated generated files in the same task/PR
- api-zod index exports only `./generated/api` (not api.schemas — zod mode doesn't split)
