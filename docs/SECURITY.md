# Security Notes

**Authentication.** Opaque random session tokens; only their SHA-256 is stored. Cookie is `HttpOnly`, `SameSite=Lax`, `__Host-` prefixed and `Secure` in production.
Passwords use Argon2id (19 MiB, t=2, p=1). Login timing is equalised for unknown accounts, errors are generic, accounts lock after 5 failures (15 min), and sign-in/reset requests are rate limited per email and IP in Postgres.
Password reset tokens are random, stored hashed, single-use (race-tested) and expire in 30 minutes; a reset revokes all sessions.

**Authorization.** Role matrix in `src/lib/permissions`. Every server action and admin page re-checks the role server-side; `proxy.ts` is only a first gate.
Admins cannot act on admin-level accounts; the last Super Admin is protected.

**Data.** All queries go through Drizzle (parameterised). Search wildcards are escaped. Quiz answer keys are never serialised to clients. Rendering of content uses a small safe renderer that never injects HTML.
No customer data is stored by design. Roleplay stores scores only.

**Transport/headers.** CSP (no third-party origins, `frame-ancestors 'none'`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP.
`script-src` still allows `'unsafe-inline'` because Next injects inline bootstrap scripts; moving to nonces is a possible hardening step.

**Cost abuse.** Roleplay turns are rate limited per user (60 / 10 min) because they may call a paid AI API. The API key is only read on the server.

**Audit.** Security-relevant events are logged; a sanitiser strips secrets before storage.

**Known limitations / residual risk**
- No MFA yet. For a small internal team, strong passwords + lockout were prioritised; MFA (TOTP) is a sensible next step.
- CSRF protection relies on Next.js server-action origin checks and `SameSite=Lax` cookies.
- `npm audit` reports moderate advisories in the dev-only ESLint toolchain; CI fails only on high+ in production dependencies.
- Run `bootstrap:admin` over a trusted connection; remove the bootstrap env values afterward.
