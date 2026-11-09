# Test Results

Measured in the build sandbox on the final code. Nothing below is estimated.

| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | 0 errors |
| ESLint | 0 errors, 0 warnings (6 `set-state-in-effect` suppressions, each with an inline reason) |
| Vitest | **58 / 58 passed** in 8 files: unit (permissions, roleplay engine), component/RTL (CopyButton, FavoriteButton, RichText), integration against in-memory Postgres (auth, content, admin) |
| `next build` | Succeeds; all routes compile |
| Playwright E2E + axe | **64 / 64 passed** (desktop + mobile Pixel 7): login failure, route protection, admin creates employee, forced password change, employee blocked from `/admin`, suspension ends a live session, script search, live-call keyboard, Ctrl+K palette, academy, roleplay mode label, theme persistence |
| axe-core (WCAG 2.0/2.1/2.2 A+AA) | 0 violations on 13 key pages in light **and** dark, desktop and mobile; separate sweep of 19 pages in light mode also clean |
| Horizontal overflow at 375 px | None on 8 sampled pages |
| `npm audit --omit=dev` | 0 vulnerabilities |
| `npm audit` (all) | 12 moderate, in the dev-only ESLint toolchain |

## What the integration tests prove
Seed volumes and idempotency (103 scripts, 66 objections, 36 templates, 58 articles, 12 courses); no price/guarantee literals in scripts;
LIKE-wildcard escaping; per-user favourites; draft/deleted content hidden; certificate gating (needs all lessons **and** a pass; one per course; not readable by other users);
quiz answer key never returned; admin cannot create/modify admins; last Super Admin protected; suspension revokes sessions; reset links are audited and never log the token;
script versions + restore; analytics return `null` rather than fake averages when there is no data.

## Not measured / not done
- **Lighthouse:** not run, so no scores are claimed.
- **Production deployment:** **not performed.** Blockers: no production PostgreSQL credentials (Neon), no GitHub repository to import, and the connected Vercel account
  (`shuraimnms`) is not the account of the session user, so deploying there needed explicit confirmation. See "Deploy" in SETUP.md — every step is ready (`vercel.json`, CI, migrations, seed, bootstrap).
  DNS for `sales.nextrovalabs.in` must be created after the Vercel domain is added (typically `CNAME sales → cname.vercel-dns.com`; use the exact value Vercel shows).
- **Cross-browser:** only Chromium was exercised.
- **Load testing:** not done.
- The sandbox's Playwright browser build differs from the project's pinned `@playwright/test`, so `PW_CHROMIUM_PATH` was used locally; CI installs the matching browser.
- The local test admin (`admin@example.test`) exists only in the throw-away local database and must not be reused anywhere.
