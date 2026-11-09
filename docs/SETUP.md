# Setup & Deployment Guide

## 1. Requirements

- Node.js 22+
- A PostgreSQL database. Production target: **Neon** (use the *pooled* host for `DATABASE_URL`, the *direct* host for `DIRECT_URL`).
- (Optional) Resend API key for password-reset email. Without it, admins issue reset links from **Admin → Employees**.
- (Optional) Anthropic API key for AI roleplay replies. Without it the simulator runs its rule-based mode and says so on screen.

## 2. Environment variables

See `.env.example`. Never commit real values.

| Variable | Required | Meaning |
|---|---|---|
| `DATABASE_URL` | yes | Pooled connection string, `sslmode=require` for Neon |
| `DIRECT_URL` | for migrations | Non-pooled string used by `drizzle-kit` |
| `APP_URL` | yes | Public base URL (used in reset links), e.g. `https://sales.nextrovalabs.in` |
| `SESSION_TTL_HOURS` | no | Session lifetime, default 12 |
| `DB_POOL_MAX` | no | Override per-instance connection cap (default 3 on Vercel, 10 elsewhere) |
| `RESEND_API_KEY`, `MAIL_FROM` | no | Reset email delivery |
| `AI_PROVIDER` | no | `none` (default) or `anthropic` |
| `ANTHROPIC_API_KEY`, `AI_MODEL` | with `anthropic` | Used server-side only; never sent to the browser |

## 3. Local development

```bash
npm ci
cp .env.example .env.local
```

**With your own Postgres:** set `DATABASE_URL` and skip to the migrate step.

**Without Postgres:** `npm run db:local` starts an in-process PGlite server on port 5433; use
`DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/postgres` (it accepts one connection at a time, so the app pool is capped at 1 automatically for localhost URLs). This is a development convenience only — not for production.

```bash
npm run db:migrate
npm run seed
BOOTSTRAP_EMAIL=... BOOTSTRAP_NAME=... BOOTSTRAP_PASSWORD=... npm run bootstrap:admin
npm run dev
```

`bootstrap:admin` creates the first Super Admin and then refuses to run again once any Super Admin exists.
The password policy is: ≥ 10 characters with upper case, lower case and a digit.

## 4. Deploying to Vercel + Neon

1. **Neon:** create a project, copy the pooled and direct connection strings.
2. **Migrate and seed from a trusted machine** (not at request time):
   ```bash
   DIRECT_URL='<direct>' DATABASE_URL='<direct>' npm run db:migrate
   DATABASE_URL='<direct>' npm run seed
   DATABASE_URL='<direct>' BOOTSTRAP_EMAIL=... BOOTSTRAP_NAME=... BOOTSTRAP_PASSWORD=... npm run bootstrap:admin
   ```
3. **Vercel:** import the GitHub repo. Framework preset: Next.js (settings are in `vercel.json`).
   Add the environment variables above (`DATABASE_URL` = **pooled** string, `APP_URL`, …) for Production.
4. **Domain:** add `sales.nextrovalabs.in` in Vercel → Project → Domains. At your DNS provider create the record Vercel
   shows (normally `CNAME sales → cname.vercel-dns.com`). Wait for the certificate to be issued.
5. **Verify** after the first deploy: sign in, open `/live-call`, create a test employee, sign in as them, confirm `/admin/dashboard` redirects away,
   then suspend that employee and confirm they are signed out. Delete the test user afterwards.

### Things worth knowing

- Sessions are stored in the database, so a redeploy does not sign anyone out. Suspending a user ends their sessions immediately.
- Rate-limit counters are also in the database, so limits hold across serverless instances.
- Cookies use the `__Host-` prefix in production (HTTPS only, path `/`, no domain).
- Security headers (CSP, HSTS, frame denial, etc.) are set in `next.config.ts`.

## 5. CI

`.github/workflows/ci.yml` runs on every push/PR: typecheck → lint → unit/integration tests → production build → `npm audit` (production deps, high+),
then a second job that boots Postgres, migrates, seeds, bootstraps a throw-away admin and runs the Playwright + axe suite.
No secrets are required; CI uses a generated, throw-away admin password.

## 6. Running E2E locally

```bash
export E2E_ADMIN_EMAIL=...   E2E_ADMIN_PASSWORD=...     # an admin of a TEST database
npm run build && npm run test:e2e
```
Set `PW_CHROMIUM_PATH` to use an already-installed Chromium. **Never run E2E against production:** the suite creates and suspends a test employee.
The E2E suite signs in once and reuses the session because the app's own login rate limit (correctly) throttles repeated sign-ins.

## 7. Backups & recovery

Use Neon's point-in-time restore. The seed is idempotent; re-running it restores any *missing* default content but never overwrites edited items.
Script edits are versioned in the app (**Admin → Scripts → item → Version history → Restore**).
