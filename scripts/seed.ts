import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
import { seedContent, contentCounts } from "../src/content/seed";

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const local = /localhost|127\.0\.0\.1/.test(url) || /sslmode=disable/.test(url);
  const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: true }, max: 1 });
  const db = drizzle(pool, { schema });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary = await seedContent(db as any);
  console.log("Seeded (idempotent):", summary);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log("Rows in database:", await contentCounts(db as any));
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
