# Build Agent Prompt — TaskFlow MVP Phase 1

> Hand this prompt to an AI coding agent to implement or continue the build.

---

## Context

Build **TaskFlow**, a production-grade TODO web app. Full specs live in `docs/`. Do NOT over-engineer — no WebSockets, CRDTs, Elasticsearch, or native apps in Phase 1.

---

## Workspace Setup

Next.js 15+ in workspace root with:
- TypeScript (strict), App Router, Tailwind CSS
- Drizzle ORM + PostgreSQL (Neon) or SQLite for local dev
- Better Auth (Google OAuth + email/password)
- shadcn/ui components
- Vitest + Playwright

---

## Database Schema

Implement per `docs/BACKEND-SCHEMA.md`:
- user_profiles (IANA timezone)
- lists (sort_key, soft delete)
- tasks (status, priority, sort_key, due_date, soft delete, search)

Use Drizzle migrations.

---

## Core Features (Order)

1. Auth + protected `/app/*` routes + timezone onboarding
2. Lists CRUD with color + reorder
3. Tasks CRUD via Server Actions + Zod (**merge partial updates**)
4. Views: Today, Upcoming, All, By List (user timezone)
5. Drag-drop reorder (@dnd-kit + sort_key)
6. Complete + Undo (useOptimistic + 5s toast)
7. Soft delete + Trash (30-day)
8. Search (FTS or ilike for MVP) + Cmd+K
9. Dark/light/system theme
10. Mobile-responsive + FAB

---

## Architecture Rules

- Server Components for data fetching
- Server Actions for mutations + Zod + revalidatePath
- Singleton Drizzle client (`lib/db.ts`, `server-only`)
- Repository pattern under `lib/repositories/`
- Label default list **"My Tasks"**

---

## Edge Cases

- sort_key fractional indexing between neighbors
- UTC storage; date views in user timezone
- `WHERE deleted_at IS NULL` on all active queries
- Client UUID for optimistic creates

---

## Testing

- Unit: sort_key, timezone filtering, partial update merge
- E2E: create → complete → undo → delete → restore
- axe-core on main views

---

## Do NOT Build (Phase 2+)

Recurring tasks, push notifications, offline sync, sharing, subtasks, attachments

---

## Definition of Done

See `docs/IMPLEMENTATION-PLAN.md`
