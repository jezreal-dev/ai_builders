# PRD — TaskFlow Product Requirements Document

**Version:** 1.1 (post-audit)  
**Last updated:** 2026-07-21  
**Status:** Build-ready

---

## 1. Product Vision

**TaskFlow** — a fast, calm, cross-device task manager that respects user attention. Not another guilt-driven productivity app.

---

## 2. Target Users

| Persona | Need | Success Metric |
|---------|------|----------------|
| **Solo Professional (Primary)** | Capture tasks in <3s, triage by priority/date | Daily active use, <2s task creation |
| **Small Team Lead (Secondary)** | Shared project lists, assign tasks | 2+ collaborators per shared list (Phase 3) |
| **Mobile-First User** | Works on mobile browsers | Responsive, touch-friendly |

---

## 3. MVP Scope (Phase 1)

### In Scope
- Email + OAuth auth (Google)
- Lists (projects) with color tags
- Tasks: title, description, due date, priority (P1–P4), status (todo/in-progress/done)
- Drag-and-drop reorder within lists
- Today / Upcoming / All views
- Full-text search (PostgreSQL FTS)
- Soft delete + 30-day trash + undo (5s toast)
- Dark/light/system theme
- Responsive web (mobile-first)

### Out of Scope (Phase 2+)
- Real-time collaboration
- Native mobile apps
- Recurring tasks
- Push notifications
- AI task parsing
- Subtasks
- File attachments

---

## 4. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-01 | User can create account via email or OAuth | P0 | Registration < 30s |
| FR-02 | User can create/edit/delete tasks | P0 | CRUD; max title 500 chars |
| FR-03 | User can organize tasks into lists | P0 | Create/rename/delete lists |
| FR-04 | User can set due date and priority | P0 | Date picker; 4 priority levels |
| FR-05 | User can reorder tasks via drag-drop | P0 | Order persists after refresh |
| FR-06 | User can mark tasks complete with undo | P0 | Animation + 5s undo toast |
| FR-07 | User can search tasks | P1 | Results < 300ms for 10K tasks |
| FR-08 | Deleted tasks go to trash for 30 days | P1 | Restore or permanent delete |
| FR-09 | Views: Today, Upcoming, All, By List | P0 | Correct filtering in user timezone |
| FR-10 | App works on mobile browsers | P0 | 44px min tap targets |
| FR-11 | User can delete account | P1 | Data purged after 30-day grace |
| FR-12 | Date views use user IANA timezone | P0 | Tasks appear on correct calendar day |
| FR-13 | Partial updates preserve unspecified fields | P0 | No accidental field nulling |

---

## 5. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page load (LCP) | < 2.5s on 4G |
| NFR-02 | Task creation (perceived) | < 200ms (optimistic UI) |
| NFR-03 | Uptime | 99.9% |
| NFR-04 | Data durability | Zero acknowledged-write loss |
| NFR-05 | Accessibility | WCAG 2.1 AA |
| NFR-06 | Security | OWASP Top 10; rate limiting on auth |
| NFR-07 | Auth rate limit | 5 attempts/min/IP |
| NFR-08 | Mutation latency p95 | < 500ms server-side |

---

## 6. Success Metrics (90-day)

- **Activation:** 60% create ≥3 tasks in first session
- **Retention:** D7 ≥ 35%, D30 ≥ 20%
- **Completion rate:** ≥ 40% of tasks done within 7 days
- **NPS:** ≥ 40
