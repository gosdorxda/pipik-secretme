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

### Codegen
- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- api-zod index exports only `./generated/api` (not api.schemas — zod mode doesn't split)
