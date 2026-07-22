# Implementation Plan — TaskFlow

**Version:** 1.0  
**Last updated:** 2026-07-21

---

## Phase 1 — MVP (Weeks 1–6)

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| 1 | Project scaffold | Next.js, Drizzle, Neon/SQLite dev, Better Auth, shadcn, CI |
| 2 | Auth + profiles | Sign up/in, OAuth, timezone, protected routes |
| 3 | Lists + tasks CRUD | Server Actions, Zod, optimistic UI, soft delete |
| 4 | Views + ordering | Today/Upcoming/All, drag-drop sort_key, priority/due |
| 5 | Search + polish | PG FTS, undo toasts, keyboard shortcuts, dark mode |
| 6 | QA + launch | Playwright E2E, a11y, deploy Vercel |

---

## Phase 2 — Reliability (Weeks 7–10)

- RFC 5545 recurring tasks (rrule.js)
- Reminder scheduler + idempotency keys
- Offline-first: IndexedDB + `updated_since` sync API
- Email reminders

---

## Phase 3 — Collaboration (Weeks 11–14)

- Shared lists (owner/editor/viewer RBAC)
- SSE live updates
- Conflict resolution UI (409)

---

## Phase 4 — Growth (Weeks 15+)

- Native mobile
- AI natural language parsing
- Calendar/Slack integrations
- Team billing

---

## Current Sprint (Implementation Session)

1. ✅ Create `docs/` with all essential documents
2. ⬜ Scaffold Next.js project in workspace root
3. ⬜ Database schema + migrations
4. ⬜ Auth flow
5. ⬜ Lists + tasks + views
6. ⬜ Search, theme, drag-drop
7. ⬜ Tests + root README

---

## Definition of Done (MVP)

- [ ] FR-01 through FR-13 implemented (Phase 1 subset)
- [ ] `pnpm dev` / `npm run dev` runs clean
- [ ] Unit tests pass
- [ ] E2E critical path passes
- [ ] Production build succeeds
- [ ] Root README with setup instructions
