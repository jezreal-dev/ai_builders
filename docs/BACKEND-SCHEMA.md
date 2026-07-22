# Backend Schema — TaskFlow (PostgreSQL)

**Version:** 1.1  
**Last updated:** 2026-07-21  
**ORM:** Drizzle

---

## Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

---

## Tables

### user_profiles

Extends Better Auth user with app-specific fields.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Matches auth user id |
| display_name | TEXT | |
| timezone | TEXT NOT NULL DEFAULT 'UTC' | IANA identifier |
| theme | TEXT DEFAULT 'system' | light \| dark \| system |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### lists

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK → user_profiles | CASCADE |
| name | TEXT | 1–100 chars |
| color | TEXT DEFAULT '#6366F1' | |
| sort_key | TEXT DEFAULT 'a0' | Fractional indexing |
| archived_at | TIMESTAMPTZ | nullable |
| deleted_at | TIMESTAMPTZ | soft delete |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| version | INTEGER DEFAULT 1 | sync metadata |

**Index:** `(user_id, sort_key) WHERE deleted_at IS NULL AND archived_at IS NULL`

---

### tasks

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| list_id | UUID FK → lists | CASCADE |
| title | TEXT | 1–500 chars |
| description | TEXT | nullable |
| status | TEXT | todo \| in_progress \| done |
| priority | SMALLINT | 1–4 (1 = highest) |
| sort_key | TEXT | fractional indexing |
| due_date | DATE | wall-clock in user TZ |
| due_time | TIME | optional |
| completed_at | TIMESTAMPTZ | nullable |
| rrule | TEXT | Phase 2 — RFC 5545 |
| recurrence_tz | TEXT | Phase 2 — IANA |
| client_op_id | UUID | Phase 2 — idempotency |
| deleted_at | TIMESTAMPTZ | soft delete |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| version | INTEGER | |
| search_vector | TSVECTOR | generated for FTS |

**Indexes:**
- `(user_id, list_id, sort_key) WHERE deleted_at IS NULL`
- `(user_id, due_date) WHERE deleted_at IS NULL AND status != 'done'`
- GIN on `search_vector`
- `(updated_at)`
- UNIQUE `(list_id, client_op_id) WHERE client_op_id IS NOT NULL`

---

### change_log (Phase 2/3)

| Column | Type | Notes |
|--------|------|-------|
| id | BIGSERIAL PK | |
| entity_type | TEXT | task \| list |
| entity_id | UUID | |
| user_id | UUID | |
| operation | TEXT | create \| update \| delete |
| payload | JSONB | |
| seq | BIGINT | server-assigned order |
| created_at | TIMESTAMPTZ | |

---

### notification_outbox (Phase 2)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID | |
| task_id | UUID FK | nullable |
| channel | TEXT | email \| push \| in_app |
| idempotency_key | TEXT UNIQUE | |
| scheduled_at | TIMESTAMPTZ | |
| sent_at | TIMESTAMPTZ | nullable |

---

## Query Conventions

- **Always** filter `deleted_at IS NULL` for active records (except trash view)
- Partial updates: `SET` only provided columns
- Date views: convert "today" using `user_profiles.timezone`
