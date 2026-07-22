# TRD — TaskFlow Technical Requirements Document

**Version:** 1.1 (post-audit)  
**Last updated:** 2026-07-21

---

## 1. Architecture

```
Client (Next.js App Router, React 19, shadcn/ui)
    ↓ Server Actions + Zod
Auth (Better Auth) → Repository Layer → Drizzle ORM → PostgreSQL (Neon)
    ↓
Upstash Redis (rate limiting, Phase 2 cache)
```

---

## 2. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary keys | UUID | Distributed-safe; upsert-friendly |
| Task ordering | Lexicographic `sort_key` | O(1) reorder |
| Deletes | Soft delete (`deleted_at`) | Undo, trash, sync tombstones |
| Timestamps | `timestamptz` UTC; IANA tz for schedules | DST-safe |
| Mutations | Server Actions + Zod | Type-safe; no separate REST for UI |
| Sync API (Phase 2) | `GET /changes?since=` + client UUID upsert | Proven offline-first pattern |
| Real-time (Phase 3) | SSE first | Lower ops complexity than WebSockets |
| Conflicts | Server seq + LWW; 409 for manual resolve | CRDT deferred |

---

## 3. Server Actions Contract

```typescript
createTask({ listId, title, description?, dueDate?, priority? })
updateTask({ id, ...partialFields })  // MERGE only — never replace unspecified fields
deleteTask({ id })                       // soft delete
restoreTask({ id })
reorderTask({ id, beforeId?, afterId? })
toggleComplete({ id })
searchTasks({ query, listId?, status? })
```

### Critical: Partial Update Rule (FR-13)

`updateTask` MUST use field-level merge. Unspecified fields are never set to NULL. This prevents recurrence/metadata wipe bugs documented in Todoist and TickTick integrations.

---

## 4. Security

- Auth: httpOnly cookies; CSRF via Better Auth
- Rate limit: 100 req/min/user mutations; 5/min/IP on auth
- Input: Zod on every Server Action
- SQL: Parameterized queries only (Drizzle)
- Headers: CSP, X-Frame-Options, HSTS
- Secrets: env vars; `server-only` on DB module

---

## 5. Database Connection (Serverless)

- Singleton Drizzle client in `lib/db.ts` with `globalThis` pattern
- Neon pooled connection URL: `?sslmode=require`
- Never `$disconnect()` per request

---

## 6. Observability

- Sentry for errors
- Structured logging (pino)
- Vercel Analytics for Web Vitals

---

## 7. Testing

| Layer | Tool | Target |
|-------|------|--------|
| Unit | Vitest | Repository, sort_key, timezone logic |
| Property-based | fast-check | Sort key collision-free inserts |
| E2E | Playwright | Create, complete, undo, trash |
| A11y | axe-core | Zero critical violations |

---

## 8. File Structure

```
/app
  /(auth)/login, signup
  /(app)/today, upcoming, lists/[id], trash, settings
  /api/auth/[...all]
/components
  /tasks, /lists, /ui
/lib
  /db, /repositories, /actions, /utils
/drizzle
/tests
/docs
```
