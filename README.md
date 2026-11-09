# Nextrova Sales OS

Private, internal sales-enablement and training platform for **Nextrova Labs** employees
(target: `https://sales.nextrovalabs.in`). It helps employees *talk to customers better* — live-call scripts,
objection handling, a training academy, roleplay practice, WhatsApp templates and a knowledge base — and gives admins a
CMS and analytics for that content.

> **Deliberately not included:** lead capture, CRM, Meta Ads integration, lead assignment, customer database,
> pipeline, customer contact storage, auto-calling and customer payment collection. The system stores employees,
> content, learning progress and audit logs only — never customer data.

## What is in it

| Area | Notes |
|---|---|
| Employee dashboard | Progress, favourites, recent activity, announcements — computed from real rows |
| **Live Call Companion** | Pick service + call stage + what the customer says → recommended script, alternatives, things to avoid. Keyboard driven (A/F/←/→/Esc), focus mode, text-size control |
| Script library | 103 Hinglish scripts, versioned, searchable, favouritable, copy-to-clipboard |
| Objection library | 66 objections × 4 response variants (recommended / short / detailed / alternative) |
| Sales Academy | 12 courses · 60 lessons · quizzes (graded server-side) · certificates issued only after all lessons are done **and** the quiz is passed |
| Roleplay simulator | 7 customer personalities × 4 project types × 3 difficulties, 6 scoring criteria. Rule-based by default and clearly labelled; optional AI replies from the server only |
| WhatsApp templates | 36 templates (English + Hinglish) in 12 categories |
| Knowledge base | 58 articles in 13 sections |
| Global search | `Ctrl/Cmd + K` over scripts, objections, templates, articles, courses |
| Admin CMS | Scripts (version history + restore), objections, templates, articles, courses/lessons/quiz questions, announcements, employees, analytics, audit log (Super Admin) |
| Themes / a11y | Light, dark, system; responsive; axe-checked against WCAG 2.2 AA |

## Stack

Next.js 16 (App Router, `proxy.ts`) · React 19 · strict TypeScript · Tailwind CSS v4 · Radix primitives · cmdk · Motion ·
Recharts · Zod · **Drizzle ORM** + PostgreSQL (Neon) · Argon2id · Vitest + React Testing Library · Playwright + axe-core.

Layering: `src/app` (routes + server actions) → `src/services` (business rules, all take a `DB`) → `src/lib/db` (Drizzle schema).
Services are tested directly against an in-memory Postgres (PGlite), so business rules are verified without a network database.

## Quick start

```bash
npm ci
cp .env.example .env.local          # fill DATABASE_URL, DIRECT_URL, APP_URL
npm run db:migrate                  # apply drizzle/0000_init.sql
npm run seed                        # idempotent: loads all content
BOOTSTRAP_EMAIL=you@nextrovalabs.in BOOTSTRAP_NAME="Your Name" \
BOOTSTRAP_PASSWORD='choose-a-strong-one' npm run bootstrap:admin
npm run dev
```

Full instructions, including deployment to Vercel + Neon and DNS: **[docs/SETUP.md](docs/SETUP.md)**.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest — unit, component (RTL) and DB-backed integration tests |
| `npm run test:e2e` | Playwright E2E + axe (needs a running app and a *test* database) |
| `npm run db:generate` / `db:migrate` | Drizzle migrations |
| `npm run seed` | Load/refresh content (never overwrites admin edits for existing slugs) |
| `npm run bootstrap:admin` | Create the first Super Admin (works exactly once) |
| `npm run db:local` | Local PGlite socket server for development without installing Postgres |

## Documentation

- [Setup & deployment guide](docs/SETUP.md)
- [Admin guide](docs/ADMIN_GUIDE.md)
- [Employee guide](docs/EMPLOYEE_GUIDE.md)
- [Security notes](docs/SECURITY.md)
- [Test results](docs/TEST_RESULTS.md)
- [Open items needing a human decision](docs/OPEN_ITEMS.md)

## Content integrity

Anything that states a company fact (prices, timelines, payment terms, policies, guarantees, team size, clients) is
**not invented**. Where the source material did not supply a verified fact, the item is flagged
`PENDING_ADMIN_CONFIRMATION` and shown with a "Pending confirmation" badge until an admin edits and approves it.
See [OPEN_ITEMS](docs/OPEN_ITEMS.md).
