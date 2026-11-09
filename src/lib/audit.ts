import { auditLogs } from "@/lib/db/schema";
import type { DB } from "@/lib/db";

const SENSITIVE = /pass(word)?|secret|token|hash|cookie|authorization|api[-_]?key/i;

/** Recursively strip anything that looks like a secret before it reaches the audit table. */
export function sanitize(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => sanitize(v, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, SENSITIVE.test(k) ? "[redacted]" : sanitize(v, depth + 1)]),
    );
  }
  if (typeof value === "string" && value.length > 500) return value.slice(0, 500) + "…";
  return value;
}

export async function audit(
  db: DB,
  entry: { actorId: string | null; action: string; resource: string; resourceId?: string | null; metadata?: Record<string, unknown> },
) {
  await db.insert(auditLogs).values({
    actorId: entry.actorId,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId ?? null,
    metadata: entry.metadata ? (sanitize(entry.metadata) as Record<string, unknown>) : null,
  });
}
