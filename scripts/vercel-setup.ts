/**
 * Runs during the Vercel build (before `next build`): applies migrations, loads default content (idempotent)
 * and creates the first Super Admin if BOOTSTRAP_* are set and none exists. Safe to re-run on every deploy.
 * Skips quietly when no database is configured so the build never fails on a fresh project.
 */
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq } from "drizzle-orm";
import path from "node:path";
import * as schema from "../src/lib/db/schema";
import { seedContent, contentCounts } from "../src/content/seed";
import { bootstrapSuperAdmin } from "../src/services/auth.service";

async function main() {
  // Prefer a direct (non-pooled) connection for DDL when the Vercel/Neon integration provides one.
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) { console.log("[setup] No DATABASE_URL - skipping database setup."); return; }
  const local = /localhost|127\.0\.0\.1|sslmode=disable/.test(url);
  const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: true }, max: 1 });
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- same object, typed for the shared DB interface
    const db = drizzle(pool, { schema }) as any;
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("[setup] Migrations applied.");
    if (!(await contentCounts(db)).scripts) { await seedContent(db); console.log("[setup] Default content loaded."); }
    const has = (await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.role, "SUPER_ADMIN")).limit(1)).length > 0;
    if (has) { console.log("[setup] Super Admin already exists."); return; }
    const { BOOTSTRAP_EMAIL: email, BOOTSTRAP_NAME: name, BOOTSTRAP_PASSWORD: password } = process.env;
    if (!email || !password) { console.log("[setup] No Super Admin yet. Set BOOTSTRAP_EMAIL, BOOTSTRAP_NAME, BOOTSTRAP_PASSWORD and redeploy."); return; }
    await bootstrapSuperAdmin(db, { email, name: name || "Super Admin", password });
    console.log(`[setup] Super Admin created for ${email}. Remove BOOTSTRAP_PASSWORD from Vercel env now.`);
  } finally { await pool.end(); }
}
main().catch((e) => { console.error("[setup] FAILED:", e.message); process.exit(1); });
