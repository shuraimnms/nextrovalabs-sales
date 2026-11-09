import "server-only";
import path from "node:path";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import { seedContent, contentCounts } from "@/content/seed";
import { bootstrapSuperAdmin } from "@/services/auth.service";
import { getDb, isEmbedded, schema } from "./index";

/**
 * First-boot setup for the built-in database: apply migrations, load the default content (idempotent),
 * and create the first Super Admin from BOOTSTRAP_* env vars if none exists yet.
 * Does nothing when an external PostgreSQL (DATABASE_URL) is configured.
 */
export async function initEmbedded() {
  if (!isEmbedded()) return;
  // On Vercel the embedded database cannot persist; the UI shows a "connect a database" notice instead of failing every request.
  if (process.env.VERCEL) { console.warn("[nsos] No DATABASE_URL on Vercel - connect a Postgres database to this project."); return; }
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the migrator wants the pglite-typed db; same object at runtime
  await migrate(db as any, { migrationsFolder: path.join(process.cwd(), "drizzle") });

  const counts = await contentCounts(db);
  if (!counts.scripts) {
    await seedContent(db);
    console.log("[nsos] Default content loaded.");
  }

  const hasSuper = (await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.role, "SUPER_ADMIN")).limit(1)).length > 0;
  if (hasSuper) return;
  const { BOOTSTRAP_EMAIL: email, BOOTSTRAP_NAME: name, BOOTSTRAP_PASSWORD: password } = process.env;
  if (!email || !password) {
    console.warn("[nsos] No Super Admin exists. Set BOOTSTRAP_EMAIL, BOOTSTRAP_NAME and BOOTSTRAP_PASSWORD and restart once to create it.");
    return;
  }
  try {
    await bootstrapSuperAdmin(db, { email, name: name || "Super Admin", password });
    console.log(`[nsos] Super Admin created for ${email}. Remove BOOTSTRAP_PASSWORD from the environment now.`);
  } catch (e) {
    console.error("[nsos] Bootstrap failed:", (e as Error).message);
  }
}
