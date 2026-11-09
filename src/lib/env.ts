import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  APP_URL: z.string().url().default("http://localhost:3000"),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(24 * 30).default(12),
  AI_PROVIDER: z.enum(["none", "anthropic"]).default("none"),
  ANTHROPIC_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
});

export type Env = z.infer<typeof schema>;
let cached: Env | undefined;
export function env(): Env {
  cached ??= schema.parse(process.env);
  return cached;
}
