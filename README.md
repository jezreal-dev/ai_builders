# TaskFlow

A fast, calm, cross-device task manager. Built with Next.js 15, Drizzle ORM, Better Auth, and Tailwind CSS 4.

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up the database
npm run db:generate
npm run db:migrate

# Start the development server
npm run dev
```

The app runs at **http://localhost:5000**.

---

## Environment Variables

Copy `.env.example` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | No | SQLite file path (default: `./taskflow.db`) |
| `BETTER_AUTH_SECRET` | Yes (prod) | 32+ char random string for auth |
| `BETTER_AUTH_URL` | No | App base URL (default: `http://localhost:5000`) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

---

## Database

This project uses **SQLite** (via better-sqlite3) for local development.

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to the database
npm run db:migrate

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19 + Tailwind CSS 4 |
| ORM | Drizzle ORM |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | Better Auth |
| Drag-drop | @dnd-kit |
| Dates | date-fns + @date-fns/tz |
| Toasts | Sonner |
| Search | cmdk |
| Testing | Vitest + Playwright |

---

## Features

- **Auth** — Email/password signup & login (Google OAuth optional)
- **Lists** — Create color-coded task lists
- **Tasks** — Create, edit, complete, delete with CRUD
- **Views** — Today, Upcoming (7 days), All Tasks, by List
- **Drag & drop** — Reorder tasks with fractional sort keys
- **Search** — Cmd+K full-text search
- **Trash** — Soft delete with 30-day retention + restore
- **Dark mode** — Light/dark/system via next-themes
- **Responsive** — Mobile-first layout

---

## Project Structure

```
src/
  app/
    (auth)/          # Login & signup pages
    (app)/           # Main app pages (protected)
      today/         # Today view
      upcoming/      # Next 7 days
      all/           # All tasks
      lists/[id]/    # List detail
      trash/         # Deleted tasks
      settings/      # User settings
    api/auth/        # Better Auth handler
  components/
    tasks/           # Task cards, list, drag-drop, detail sheet
    lists/           # Sidebar, create-list dialog
    search/          # Cmd+K search modal
    layout/          # App header
    settings/        # Settings form
    ui/              # Base UI components (button, input, etc.)
  lib/
    actions/         # Server Actions (task, list, user)
    repositories/    # DB query layer
    auth/            # Better Auth config + session helpers
    db/              # Drizzle client + schema + migrations
    utils/           # sort-key, timezone, cn
drizzle/             # Migration files
docs/                # PRD, TRD, UI/UX spec, schema, logbook
```

---

## Docs

All product and engineering documentation lives in `/docs`:

- `PRD.md` — Product requirements
- `TRD.md` — Technical requirements
- `UI-UX-DESIGN.md` — Design specification
- `APP-FLOW.md` — User journey & app flows
- `BACKEND-SCHEMA.md` — Database schema
- `TECH-STACK.md` — Stack decisions
- `IMPLEMENTATION-PLAN.md` — Phase roadmap
- `QUALITY-AUDIT.md` — Requirements audit (73→90 score)
- `RESEARCH-SYNTHESIS.md` — Edge cases from production research
- `LOGBOOK.md` — Chronological research & implementation log
- `BUILD-AGENT-PROMPT.md` — Agent prompt for future phases

---

## Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (Playwright)
npm run test:e2e
```
