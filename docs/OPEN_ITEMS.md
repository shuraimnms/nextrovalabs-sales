# Open items that need a human decision

1. **Delivery timelines conflict.** The public website (nextrovalabs.in) states websites in roughly 2–3 weeks and apps in 6–12 weeks; the project brief says 1 week / 2 weeks.
   No timeline figure is presented as fact: every timeline-related script/article is `Pending confirmation`. Decide the real numbers and approve the items.
2. **Pending-confirmation content (51 items):** 13 scripts, 22 objections, 2 templates, 14 knowledge articles. They cover prices, payments, timelines, policies,
   guarantees and similar company facts that were not supplied in verified form. Counts are live on the admin home.
3. **Roleplay AI** is off by default (rule-based, labelled). To enable: `AI_PROVIDER=anthropic`, `ANTHROPIC_API_KEY`, optionally `AI_MODEL`.
4. **Password-reset email** needs `RESEND_API_KEY` + a verified sender domain; until then admins issue reset links manually.
5. **Auth architecture:** a custom, database-backed session system (with RBAC, lockout, reset flow) was used instead of Auth.js. Both are reasonable; this keeps credentials and audit in one Postgres and is fully tested.
6. **ORM:** Drizzle instead of Prisma (the Prisma engine could not be installed in the build environment; agreed during the build).
7. **MFA** is not implemented (see SECURITY.md).
8. **Hosting model.** With the built-in database the app must run on one Node host with a persistent disk (your computer or the OVH VPS). Vercel needs an external PostgreSQL.
9. **Production deployment and DNS** — not performed; see TEST_RESULTS.md.
