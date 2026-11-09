/**
 * Local-only Postgres-compatible server (PGlite over the wire protocol) for development and CI-less sandboxes.
 * NOT used in production — production uses Neon PostgreSQL. Usage: npm run db:local
 */
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import path from "node:path";

const dir = process.env.PGLITE_DIR ?? path.join(process.cwd(), ".local-db");
const port = Number(process.env.PGLITE_PORT ?? 5433);

async function main() {
  const db = await PGlite.create(dir);
  await migrate(drizzle(db), { migrationsFolder: path.join(process.cwd(), "drizzle") });
  const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1" });
  await server.start();
  console.log(`Local dev database ready on postgresql://postgres:postgres@127.0.0.1:${port}/postgres (data: ${dir})`);
  process.on("SIGINT", async () => { await server.stop(); await db.close(); process.exit(0); });
  process.on("SIGTERM", async () => { await server.stop(); await db.close(); process.exit(0); });
}
main().catch((e) => { console.error(e); process.exit(1); });
