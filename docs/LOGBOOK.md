# TaskFlow — Research & Actions Logbook

> Chronological record of research, decisions, and implementation actions for the TaskFlow TODO app project.

---

## 2026-07-21 — Session 1: Research & Planning

### Actions
- Conducted web research on TODO app complexity, edge cases, and production bugs
- Synthesized findings from system design articles, open-source implementations, and UX studies
- Drafted PRD, TRD, UI/UX spec, app flows, backend schema, and tech stack recommendation
- Performed quality assessment (initial score: 73/100)
- Completed quality audit with 12 fixes (final score: 90/100)
- Produced implementation plan (4 phases) and build-agent prompt

### Key Research Sources
| Source | Key Takeaway |
|--------|--------------|
| [Deceptive Complexity of a TODO App](https://ujjwaltiwari2.medium.com/the-deceptive-complexity-of-a-todo-app-a-deep-system-design-breakdown-3541ca5cc764) | UUID v7, fractional indexing, soft deletes, SSE over WebSockets for MVP |
| [Offline-First Sync Guide](https://medium.com/@abied.abiad/offline-first-sync-how-to-build-a-local-database-that-never-loses-data-72d02d0b03c3) | 13 sync failure modes; client IDs + upsert; server clock cursors |
| [Todizzle API](https://www.turtlebytes.com/blog/building-todizzle-a-production-ready-checklist-api-with-laravel) | RFC 5545 RRULE for recurrence; `updated_since` sync parameter |
| [Collaborative TODO Design](https://amirulislamalmamun.com/practice/system-design/013-todo-list-sharing/) | LWW with server seq; client_op_id for idempotency |
| [TickTick SDK PR #42](https://github.com/dev-mirzabicer/ticktick-sdk/pull/42) | Preserve recurrence metadata on complete; UTC datetime comparisons |
| [Home Assistant Todoist #107504](https://github.com/home-assistant/core/issues/107504) | Partial updates must not wipe `due_string`/recurrence fields |
| [Todoist Sync Troubleshooting](https://www.todoist.com/help/articles/troubleshoot-syncing-issues-in-todoist-d6dDzzpF) | Warn before clearing local data; sync status indicators |
| [MVP Usability Test Report](https://github-wiki-see.page/m/NTNU-IE-IIR/prosjekt-idata1005-2025-abc/wiki/MVP-Usability-Test-Report) | Add button visibility, hover states, completion feedback |
| [Todoist Heuristic Evaluation](https://medium.com/@tolulopeibirongbe/heuristic-evaluation-of-todoist-lessons-from-a-designers-lens-26248684a14b) | Use "My Tasks" not "Inbox"; visible edit/delete controls |

### Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Product name | TaskFlow | Clear, professional, domain-friendly |
| MVP scope | Auth + Lists + Tasks + Views + Search | Defer sync, recurrence, collaboration to Phase 2+ |
| Primary keys | UUID (gen_random_uuid / client-generated) | Distributed-safe, upsert-friendly |
| Task ordering | Lexicographic `sort_key` | O(1) reorder without full-table updates |
| Deletes | Soft delete with 30-day trash | Undo support + future sync tombstones |
| Default list label | "My Tasks" | UX research: "Inbox" confuses users |
| Stack | Next.js 15 + Drizzle + Neon + Better Auth + shadcn/ui | 2026 full-stack standard for startups |

---

## 2026-07-21 — Session 2: Documentation & Implementation Start

### Actions
- Created `docs/` directory with all essential project documents (.md)
- Initialized TaskFlow codebase in workspace root
- *(Implementation entries appended below as work progresses)*

---

## Implementation Log

<!-- Append entries as features ship -->

### Milestone: Project Scaffold
- **Status:** Pending
- **Notes:** —

### Milestone: Auth + Profiles
- **Status:** Pending
- **Notes:** —

### Milestone: Lists + Tasks CRUD
- **Status:** Pending
- **Notes:** —

### Milestone: Views + Ordering
- **Status:** Pending
- **Notes:** —

### Milestone: Search + Polish
- **Status:** Pending
- **Notes:** —

### Milestone: QA + Launch
- **Status:** Pending
- **Notes:** —

---

## Change Log (Audit Fixes Applied to Requirements)

| # | Change | Reason |
|---|--------|--------|
| 1 | Added 5-second undo toast on complete/delete | Usability: users need action confirmation |
| 2 | Partial-update merge contract in TRD | Prevents recurrence field wipe bugs |
| 3 | Timezone-aware Today view spec | Prevents wrong-day task display |
| 4 | Replaced integer position with sort_key | Avoids O(n) reorder updates |
| 5 | Added client_op_id to schema | Offline sync idempotency (Phase 2) |
| 6 | Renamed "Inbox" → "My Tasks" | UX research finding |
| 7 | Added GDPR account deletion (FR-11) | Legal compliance |
| 8 | Auth rate limiting (NFR-07) | Security baseline |
| 9 | Empty/loading/error state specs | Reduces cognitive load |
| 10 | Search performance budget (< 300ms) | Testable acceptance criteria |
| 11 | Fixed schema typo TIMESTAMPTZ | Valid SQL |
| 12 | Keyboard shortcuts spec | Power-user retention |
