# UI/UX Design Specification — TaskFlow

**Version:** 1.0  
**Last updated:** 2026-07-21

---

## Design Principles

1. **Speed over features** — task capture in one interaction
2. **Calm productivity** — no red shame badges; gentle overdue styling
3. **Visible affordances** — primary actions always visible
4. **Instant feedback** — optimistic UI + undo on destructive actions
5. **Progressive disclosure** — advanced fields expand on demand

---

## Visual Language

| Token | Value |
|-------|-------|
| Primary | `#6366F1` (Indigo 500) |
| Success | `#22C55E` |
| Overdue (gentle) | `#F59E0B` (amber) |
| Background (light) | `#FAFAFA` |
| Background (dark) | `#0A0A0B` |
| Font | Inter (UI) |
| Radius | 8px cards, 6px buttons |
| Spacing | 4px base grid |

---

## Key Screens

### Today View (Home)
- Header: "Today" + date + avatar menu
- Quick-add bar (autofocus on `N`)
- Task cards: checkbox, title, due time, priority dot, list badge
- Empty state: "What's on your mind?" + CTA
- FAB on mobile (56px, bottom-right)

### Task Detail (Slide-over)
- Inline-editable title
- Due date, priority, list mover
- Description
- Delete → trash with undo toast

### Sidebar
- **"My Tasks"** (default list — not "Inbox")
- Custom lists with color dots
- "+ New List"

### Search
- `Cmd/Ctrl+K` modal
- Instant results with highlight

---

## Interaction Patterns

| Action | Pattern |
|--------|---------|
| Complete | Checkbox → strikethrough → slide out → "Completed · Undo" toast |
| Add task | Inline input → Enter saves → focus stays |
| Reorder | Drag handle on hover |
| Delete | Soft delete → "Moved to trash · Undo" (5s) |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Focus quick-add |
| `Cmd/Ctrl+K` | Search |
| `Esc` | Close panel/modal |
| `↑/↓` | Navigate tasks |

---

## UI States (Section 3.6)

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards matching task layout |
| Empty | Contextual illustration + single CTA |
| Error | Inline retry banner |
| Offline (Phase 2) | Yellow banner: "Offline — changes saved locally" |

---

## Accessibility

- Focus rings + aria-labels on all interactive elements
- Priority indicated by icon + color (not color alone)
- Screen reader announces state changes
- `prefers-reduced-motion` respected
