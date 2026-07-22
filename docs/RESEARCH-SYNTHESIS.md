# Research Synthesis — Edge Cases, Bugs & Fixes

> Compiled from production TODO app experiences, system design literature, and open-source bug reports.

---

## The "Simple" TODO App Iceberg

Every tutorial builds CRUD in an afternoon. Production systems (Todoist, Linear, Notion tasks) solve distributed systems problems: ID generation, ordering, deletion semantics, sync, timezones, search, and notifications.

**Pragmatic rule:** Build for correctness first. Add complexity only when user complaints justify it.

---

## Known Bugs & Fixes (From Production)

| Problem | How It Manifests | Root Cause | Fix |
|---------|------------------|------------|-----|
| Duplicate tasks after offline create | Two identical tasks | Server-assigned IDs + lost HTTP reply on retry | Client-generated UUID + upsert-by-ID |
| Sync stops silently | Updates never arrive | Pull cursor uses device clock ahead of server | Use `server_time - 1ms` from API |
| Recurring task deleted on complete | "Every day" task gone forever | Update payload omits recurrence metadata | Merge partial updates; preserve `rrule`, `due_string`, `timezone` |
| Wrong completed-task queries | Tasks missing in non-UTC TZ | `datetime.now()` naive local vs UTC-aware | All instants in UTC; wall-clock in IANA timezone |
| Drag-drop order breaks | Tasks jump or duplicate | Integer positions → full rewrites; floats → precision loss | Lexicographic rank keys (fractional indexing) |
| Deleted tasks reappear | Ghost tasks in lists | Hard delete + missed sync tombstone | Soft delete with `deleted_at`; sync tombstones |
| N+1 query meltdown | App slow at scale | Unindexed joins | Indexes on `(user_id, deleted_at)`, `(list_id, sort_key)` |
| Connection pool exhaustion | 500 errors under load | New DB connection per serverless invocation | Singleton client + Neon pooler |
| Bulk update skips observers | Side effects stop | ORM bulk `update()` bypasses hooks | Iterate models when side effects matter |

---

## 13 Offline Sync Failure Modes

From [Offline-First Sync Guide](https://medium.com/@abied.abiad/offline-first-sync-how-to-build-a-local-database-that-never-loses-data-72d02d0b03c3):

1. **Lost reply → duplicates** — Client IDs + upsert
2. **Clock differences skip rows** — Server clock for cursor, never device
3. **Edge-row off-by-one** — `server_time - 1` cursor with strict `>` filter
4. **Pagination drops pages** — Loop pages; resume from last cursor on early stop
5. **Failed local write moves cursor** — Keep cursor below earliest failed row
6. **Concurrent sync triggers** — `_running` flag on push/pull
7. **Offline deletes don't survive** — Tombstones until server confirms
8. **Foreign key push order** — Parents before children
9. **Last-write-wins hides conflicts** — 409 → conflict state + user choice
10. **Background isolate has no app state** — Rebuild stack; local-only gate checks
11. **Encrypted DB errors look unrelated** — Quarantine, never delete on decrypt failure
12. **Schema migrations on offline DBs** — Additive, idempotent migrations only
13. **Screen refresh too much/little** — Refresh only when rows actually changed

**TaskFlow Phase 2** will implement sync using these rules.

---

## Ordering Algorithm

**Avoid:** Integer `position` (O(n) updates), floating-point midpoints (precision loss).

**Use:** Lexicographic `sort_key` strings. Insert between `"a"` and `"b"` → `"am"`. Periodic background rebalance if strings grow long.

Reference: [User-Defined Order in SQL](https://begriffs.com/posts/2018-03-20-user-defined-order.html) (Joe Nelson).

---

## Timezone & Recurrence Rules

- **Instants** (created_at, completed_at): `timestamptz` UTC
- **Wall-clock** (due time, reminders): `DATE`/`TIME` + IANA timezone column
- **Recurrence:** RFC 5545 RRULE (not cron expressions)
- **DST:** Compute next occurrence in user TZ; idempotent reminder delivery
- **Never** store UTC offset strings (`-05:00`) — they break on DST transitions

---

## Real-Time Transport Recommendation

| Phase | Transport | Use Case |
|-------|-----------|----------|
| MVP | HTTP + revalidatePath | Single-user, server-authoritative |
| Phase 2 | Polling / `updated_since` | Multi-device sync |
| Phase 3 | SSE | Server → client notifications |
| Phase 4+ | WebSockets + Redis pub/sub | Live collaboration |

---

## UX Friction Findings

- Primary "Add Task" button must be prominent (FAB on mobile)
- Completion needs visible feedback + undo (5s toast)
- Label default list **"My Tasks"**, not "Inbox"
- Avoid guilt-driven red overdue badges — use gentle amber
- Empty states with single CTA reduce cognitive load
- Keyboard shortcuts: `N` new, `/` or `Cmd+K` search
