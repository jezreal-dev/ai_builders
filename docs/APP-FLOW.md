# App Flow — TaskFlow

**Version:** 1.0  
**Last updated:** 2026-07-21

---

## First Session Journey

```
Landing → Sign Up (OAuth/Email) → Onboarding (Name + Timezone)
    → Today View (empty) → Quick-add first task → Complete + feedback
    → Retention hook (optional streak/stats in Phase 2)
```

---

## Task Lifecycle States

```
[*] → todo (create)
todo ↔ in_progress (start/pause)
todo | in_progress → done (complete)
done → todo (reopen/undo)
todo | in_progress | done → trash (soft delete)
trash → todo (restore)
trash → [*] (permanent delete after 30 days)
```

---

## Request Flow (MVP)

```
User Action (Client)
    → Optimistic UI update (useOptimistic)
    → Server Action
        → Zod validation
        → Auth check
        → Repository method
        → Drizzle query
    → revalidatePath
    → Return { success, data?, error? }
    → Client: toast on success/error; undo handler
```

---

## View Filtering Logic

| View | Filter |
|------|--------|
| **Today** | `due_date = today` in user timezone OR no due date + status ≠ done |
| **Upcoming** | `due_date` between tomorrow and +7 days |
| **All** | All non-deleted, non-done (or include done with toggle) |
| **By List** | `list_id = selected` |
| **Trash** | `deleted_at IS NOT NULL` |

All date comparisons use `user_profiles.timezone` (IANA).

---

## Sync Flow (Phase 2 — Reference)

```
1. Client writes locally (sync_status = pending)
2. Push: batch upserts + tombstones to server (client UUID)
3. Server upserts by ID; returns server_time
4. Pull: GET /changes?since=last_server_time
5. Client upserts locally; cursor = server_time - 1ms
6. On 409: mark conflict; show user resolution UI
```

Push order: lists before tasks (foreign key safety).
