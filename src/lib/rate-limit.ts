import { eq, sql } from "drizzle-orm";
import { rateLimitBuckets } from "@/lib/db/schema";
import type { DB } from "@/lib/db";

/**
 * Fixed-window counter persisted in Postgres so it works across serverless instances.
 * Returns whether the action is allowed; the atomic upsert avoids races between concurrent requests.
 */
export async function hit(db: DB, key: string, limit: number, windowSec: number): Promise<{ allowed: boolean; remaining: number }> {
  const rows = await db
    .insert(rateLimitBuckets)
    .values({ key, count: 1, windowStart: new Date() })
    .onConflictDoUpdate({
      target: rateLimitBuckets.key,
      set: {
        count: sql`CASE WHEN ${rateLimitBuckets.windowStart} < now() - (${windowSec} * interval '1 second') THEN 1 ELSE ${rateLimitBuckets.count} + 1 END`,
        windowStart: sql`CASE WHEN ${rateLimitBuckets.windowStart} < now() - (${windowSec} * interval '1 second') THEN now() ELSE ${rateLimitBuckets.windowStart} END`,
      },
    })
    .returning({ count: rateLimitBuckets.count });
  const count = rows[0]?.count ?? 1;
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}

export async function reset(db: DB, key: string) {
  await db.delete(rateLimitBuckets).where(eq(rateLimitBuckets.key, key));
}
