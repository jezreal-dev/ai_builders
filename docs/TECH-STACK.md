# Tech Stack — TaskFlow

**Version:** 1.0  
**Last updated:** 2026-07-21

---

## Stack Overview

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | **Next.js 15+** (App Router) | Full-stack, RSC, Server Actions |
| Language | **TypeScript** (strict) | End-to-end type safety |
| UI | **React 19** + **shadcn/ui** + **Tailwind CSS** | Accessible; `useOptimistic` |
| ORM | **Drizzle ORM** | SQL control, lightweight migrations |
| Database | **PostgreSQL** (Neon serverless) | FTS, partial indexes, pooler |
| Auth | **Better Auth** | OAuth + email; httpOnly cookies |
| Validation | **Zod** | Server Action boundary |
| Drag-drop | **@dnd-kit/core** | Accessible, touch-friendly |
| Dates | **date-fns** + **@date-fns/tz** | Timezone-aware views |
| Rate limit | **Upstash Ratelimit** (optional) | Serverless-friendly |
| Testing | **Vitest** + **Playwright** | Unit + E2E |
| Lint/format | **Biome** or ESLint | Consistent code style |
| Deploy | **Vercel** | Zero-config Next.js |
| Monitoring | **Sentry** (optional) | Error tracking |

---

## Explicitly Deferred

| Technology | When | Why Not MVP |
|------------|------|-------------|
| Elasticsearch | 100K+ tasks/user | PG FTS + pg_trgm sufficient |
| WebSockets | Phase 3 collaboration | SSE simpler for notifications |
| CRDTs (Yjs) | Offline complaints justify | High complexity |
| Separate Express API | Never (unless mobile SDK) | Server Actions cover UI |
| Redis (full) | Phase 2+ | In-memory rate limit OK for MVP dev |

---

## Environment Variables

```env
DATABASE_URL=postgresql://...?sslmode=require
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Performance Targets

- Singleton DB client + Neon pooler
- Server Components for initial data (no client fetch waterfall)
- Optimistic UI for mutations
- Generated `search_vector` column (no manual sync)
