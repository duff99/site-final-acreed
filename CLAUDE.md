# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Acreed Consulting — a marketing website + admin panel for a recruitment and consulting firm (telecoms & IT). Monochrome black/white/gray design with glassmorphism effects, Framer Motion animations. Two codebases in one repo: a React SPA frontend and an Express API backend, connected via Vite proxy in dev and nginx reverse proxy in production.

## Commands

### Frontend (root)

```bash
npm run dev          # Vite dev server on port 8081 (HMR, proxies /api to :3001)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm run preview      # Preview production build
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
npx tsc --noEmit     # Type-check frontend + shared
```

### Backend (`server/`)

```bash
cd server
npm run dev          # tsx watch src/index.ts (hot reload on :3001)
npm run build        # tsc (compiles to dist/)
npm run start        # node dist/index.js (production)
npm run db:seed      # Seed jobs + initial admin (only if tables empty)
```

### Docker (full stack)

```bash
docker-compose up --build   # frontend on :80, api on :3001, SQLite volume
```

## Tech Stack

**Frontend**: React 18, TypeScript, Vite (SWC), Tailwind CSS 3, shadcn/ui (Radix), Framer Motion, React Router 6, TanStack React Query, React Hook Form + Zod, Lucide React

**Backend**: Express 4, TypeScript (ESM via tsx), Drizzle ORM + @libsql/client (SQLite), bcryptjs, jsonwebtoken, nanoid

**Shared**: `shared/schemas.ts` (Zod) + `shared/types.ts` (TS types) — used by both frontend and backend

## Architecture

### Import Aliases

- `@/` maps to `src/` (frontend code)
- `@shared/` maps to `./shared/` (shared schemas/types)

Both aliases configured in `tsconfig.app.json` + `vite.config.ts` (frontend) and `server/tsconfig.json` (backend).

### Routing

`src/App.tsx` — BrowserRouter:

| Route | Page | Auth |
|-------|------|------|
| `/` | `Index.tsx` (landing, hash anchors: `#services`, `#jobs`, `#about`, `#contact`) | Public |
| `/offres` | `Jobs.tsx` | Public |
| `/contact` | `Contact.tsx` | Public |
| `/admin/login` | `AdminLogin.tsx` | Public |
| `/admin` | `AdminDashboard.tsx` | Protected |
| `/admin/jobs` | `AdminJobList.tsx` | Protected |
| `/admin/jobs/new` | `AdminJobForm.tsx` | Protected |
| `/admin/jobs/:id/edit` | `AdminJobForm.tsx` | Protected |
| `/admin/users` | `AdminUserList.tsx` | Protected (admin only) |
| `/admin/users/new` | `AdminUserForm.tsx` | Protected (admin only) |
| `/admin/users/:id/edit` | `AdminUserForm.tsx` | Protected (admin only) |

Admin routes wrapped in `ProtectedRoute` (redirects to `/admin/login`) and `AdminLayout` (sidebar + outlet).

### Landing Page Composition

`Index.tsx` assembles sections separated by `SectionDividerPremium`:

Navigation > HeroSection > PartnersMarquee > ServicesSection > ExpertiseSection > TeamSection > JobsSection > AboutSection > ContactSection > Footer

A `CustomCursor` (SVG arrow) renders on desktop only — `cursor: none !important` is set globally.

### Backend API

Express server in `server/src/index.ts` (port 3001). SQLite DB at `server/data/acreed.db`.

**Public endpoints**:
- `GET /api/jobs` — active jobs (optional `?sector=`)
- `GET /api/jobs/:id`
- `POST /api/auth/login` — returns `{ accessToken, user }` + sets httpOnly refresh cookie
- `POST /api/auth/refresh`, `POST /api/auth/logout`
- `GET /api/health`

**Protected endpoints** (Bearer JWT):
- `GET /api/auth/me` — current user profile
- `GET/POST/PUT/PATCH/DELETE /api/admin/jobs/*` — job CRUD + toggle
- `GET/POST/PUT/DELETE /api/admin/users/*` — admin user management (admin role only)

**RBAC** (2 roles):
- `admin`: full access (job CRUD + delete, user management)
- `editor`: job CRUD + toggle only, no delete, no user management

**Auth flow**: JWT access token (15min) + httpOnly refresh cookie (7d). Frontend `apiClient` auto-refreshes on 401.

### Frontend Data Flow

- `src/lib/api.ts` — singleton `apiClient` with auto-refresh on 401 and redirect to `/admin/login` on refresh failure
- `src/hooks/use-auth.tsx` — `AuthProvider` context with `login()`, `logout()`, `hasPermission()`, `isAdmin`, `isEditor`
- `src/hooks/use-jobs.ts` — React Query hooks: `useJobs()`, `useAdminJobs()`, `useCreateJob()`, `useUpdateJob()`, `useDeleteJob()`, `useToggleJob()`
- `src/hooks/use-admin-users.ts` — React Query hooks: `useAdminUsers()`, `useCreateAdmin()`, `useUpdateAdmin()`, `useDeleteAdmin()`
- `src/data/` — static data files for services, expertise, team, partners, values (Zod-validated)

### Database

SQLite via Drizzle ORM + @libsql/client. Tables created inline on server startup (no migration runner). Column migrations run idempotently with try/catch for "duplicate column". Two tables: `jobs` and `admins`.

## Styling Conventions

Monochrome black/white/gray only — no colors. All theming via CSS custom properties (HSL) in `src/index.css`.

**Fonts**: Playfair Display (headings, `.font-playfair`), Inter (body)

**Key CSS classes** (defined in `@layer components` in `index.css`):
- Cards: `.premium-card`, `.team-card`, `.spotlight-card`
- Buttons: `.btn-premium-primary`, `.btn-premium-secondary`, `.glass-button`, `.glass-button-primary`
- Nav: `.glass-nav`, `.glass-nav-raycast`
- Text: `.text-gradient`, `.premium-badge`, `.job-tag`

**Animation utilities** (`@layer utilities`):
- `.animate-fade-in-up`, `.animate-fade-in`, `.animate-scale-in`, `.animate-float`, `.animate-pulse-glow`
- Delay classes: `.delay-100` through `.delay-600`
- Framer Motion for complex interactions (viewport triggers, gestures, stagger orchestration)

**Custom cursor**: `cursor: none !important` is global. Never add `cursor: pointer` anywhere. `CustomCursor` component handles cursor rendering.

## Mandatory Conventions

- **shadcn/ui only**: Never create base components (Button, Input, Card, Form, etc.) from scratch. Always import from `src/components/ui/`.
- **Forms**: React Hook Form + Zod exclusively. Form components from `@/components/ui/form`.
- **No cursor styles**: The custom cursor system (`src/components/CustomCursor.tsx`) replaces the OS cursor. Never set `cursor: pointer` or similar.
- **CSS animations first**: Use existing CSS utility classes before reaching for Framer Motion.

## Environment Variables

### Backend (`server/`)

| Variable | Default | Notes |
|----------|---------|-------|
| `PORT` | `3001` | Server port |
| `DATABASE_PATH` | `./data/acreed.db` | SQLite file path |
| `JWT_SECRET` | `CHANGE-ME-IN-PRODUCTION` | **Must change in prod** |
| `ADMIN_EMAIL` | — | Required for seed |
| `ADMIN_PASSWORD` | — | Required for seed |
| `ADMIN_NAME` | `Admin` | Optional |
| `CORS_ORIGIN` | `http://localhost:8081` | Set to frontend URL in prod |
| `RESEND_API_KEY` | — | Optional. Enables email notifications on contact/application submissions via Resend API. If unset, notifications are skipped (logged) but submissions still succeed. |
| `NOTIFY_EMAIL_TO` | `recrutement@acreedconsulting.com` | Recipient for contact + application notifications |
| `NOTIFY_EMAIL_FROM` | `no-reply@acreedconsulting.com` | Verified sender (Resend domain) |

### Frontend

| Variable | Default | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `/api` | Only needed if API is on a different origin |

## Platform Notes

- `better-sqlite3` fails on Windows without Visual Studio Build Tools — this project uses `@libsql/client` instead (prebuilt binaries, same Drizzle API)
- Server runs via `tsx` (TypeScript execution) — no compile step needed in dev or Docker
