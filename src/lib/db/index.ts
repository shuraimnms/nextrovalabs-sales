import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;

const g = globalThis as unknown as { __pool?: Pool };

function createPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const local = /localhost|127\.0\.0\.1/.test(url);
  return new Pool({
    connectionString: url,
    // The local PGlite socket server (sandbox/dev only) accepts a single connection at a time.
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : local ? 1 : process.env.VERCEL ? 3 : 10,
    ssl: /sslmode=disable|localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: true },
  });
}

let _db: DB | undefined;
/** Lazily created so `next build` does not need a database connection. */
export function getDb(): DB {
  if (!_db) {
    g.__pool ??= createPool();
    _db = drizzle(g.__pool, { schema }) as unknown as DB;
  }
  return _db;
}
export { schema };
