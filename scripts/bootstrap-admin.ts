/**
 * One-time creation of the first Super Admin. Credentials are supplied at run time:
 *   BOOTSTRAP_EMAIL=... BOOTSTRAP_NAME="..." BOOTSTRAP_PASSWORD=... npm run bootstrap:admin
 * Refuses to run if a Super Admin already exists. Nothing is hardcoded or logged.
 */
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
import { bootstrapSuperAdmin } from "../src/services/auth.service";

async function main() {
  const { BOOTSTRAP_EMAIL: email, BOOTSTRAP_NAME: name, BOOTSTRAP_PASSWORD: password } = process.env;
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!email || !name || !password) throw new Error("Set BOOTSTRAP_EMAIL, BOOTSTRAP_NAME and BOOTSTRAP_PASSWORD");
  const local = /localhost|127\.0\.0\.1/.test(url) || /sslmode=disable/.test(url);
  const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: true }, max: 1 });
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = await bootstrapSuperAdmin(drizzle(pool, { schema }) as any, { email, name, password });
    console.log(`Super Admin created (id ${id}). Remove the credentials from your shell history.`);
  } finally {
    await pool.end();
  }
}
main().catch((e) => { console.error("Bootstrap failed:", e.message); process.exit(1); });
