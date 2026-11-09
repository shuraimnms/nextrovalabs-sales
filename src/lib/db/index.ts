import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { mkdirSync } from "node:fs";
import path from "node:path";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;

const g = globalThis as unknown as { __pool?: Pool; __db?: DB };

/** True when no external PostgreSQL is configured and the app runs its own embedded database. */
export const isEmbedded = () => !process.env.DATABASE_URL;
export const embeddedDir = () => process.env.DATA_DIR ?? path.join(process.cwd(), ".data", "db");

function createPool(): Pool {
  const url = process.env.DATABASE_URL!;
  const local = /localhost|127\.0\.0\.1/.test(url);
  return new Pool({
    connectionString: url,
    // The local PGlite socket server (sandbox/dev only) accepts a single connection at a time.
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : local ? 1 : process.env.VERCEL ? 3 : 10,
    ssl: /sslmode=disable|localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: true },
  });
}

function createEmbedded(): DB {
  if (process.env.VERCEL) {
    throw new Error(
      "Embedded database mode needs a persistent disk, which Vercel serverless does not have. " +
        "Run on a normal Node host (VPS / local machine) or set DATABASE_URL to a PostgreSQL server.",
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- loaded lazily so external-Postgres mode never pays for it
  const { PGlite } = require("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { drizzle: drizzlePglite } = require("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite");
  mkdirSync(embeddedDir(), { recursive: true });
  return drizzlePglite(new PGlite(embeddedDir()), { schema }) as unknown as DB;
}

/** Lazily created so `next build` does not need a database. One instance per process. */
export function getDb(): DB {
  if (!g.__db) {
    if (isEmbedded()) g.__db = createEmbedded();
    else {
      g.__pool ??= createPool();
      g.__db = drizzle(g.__pool, { schema }) as unknown as DB;
    }
  }
  return g.__db;
}
export { schema };
