import { desc, eq } from "drizzle-orm";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { env } from "@/lib/env";
import { PERSONALITIES, PROJECTS, customerReply, evaluate, type Level, type PersonalityKey, type ProjectKey, type Turn } from "@/lib/roleplay/engine";

export type Mode = "RULE_BASED" | "AI";

export function aiAvailable() {
  const e = env();
  return e.AI_PROVIDER === "anthropic" && !!e.ANTHROPIC_API_KEY;
}

/** Server-only call; the key never reaches the browser. Returns null on any failure so the caller can fall back visibly. */
async function aiReply(p: PersonalityKey, project: ProjectKey, level: Level, history: Turn[]): Promise<string | null> {
  const e = env();
  if (!aiAvailable()) return null;
  const system = `You are role-playing a prospective customer for a sales-training exercise in Hinglish. Persona: ${PERSONALITIES[p].label} — ${PERSONALITIES[p].blurb} Project: ${PROJECTS[project]}. Difficulty: ${level}. Reply with 1-3 short sentences as the customer only. Never reveal you are an AI or give the trainee advice. Do not invent real company facts.`;
  const messages = history.map((t) => ({ role: t.role === "user" ? "assistant" : "user", content: t.text }));
  // The trainee speaks as the "assistant" turn from the model's point of view; ensure it starts with a user message.
  if (messages[0]?.role !== "user") messages.unshift({ role: "user", content: "(call connected)" });
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12_000);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", signal: ctrl.signal,
      headers: { "content-type": "application/json", "x-api-key": e.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: e.AI_MODEL ?? "claude-sonnet-5-5", max_tokens: 200, system, messages }),
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const j = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = j.content?.find((c) => c.type === "text")?.text?.trim();
    return text ? text.slice(0, 600) : null;
  } catch {
    return null;
  }
}

export async function nextCustomerTurn(p: PersonalityKey, project: ProjectKey, level: Level, history: Turn[]) {
  const userTurns = history.filter((t) => t.role === "user").length;
  if (aiAvailable() && userTurns < 6) {
    const text = await aiReply(p, project, level, history);
    if (text) return { text, ended: false, mode: "AI" as Mode, fellBack: false };
    const r = customerReply(p, level, history);
    return { ...r, mode: "RULE_BASED" as Mode, fellBack: true };
  }
  const r = customerReply(p, level, history);
  return { ...r, mode: "RULE_BASED" as Mode, fellBack: false };
}

/** Stores scores only — never the transcript. */
export async function finishSession(db: DB, userId: string, p: PersonalityKey, project: ProjectKey, level: Level, mode: Mode, history: Turn[]) {
  const result = evaluate(history);
  await db.insert(s.roleplaySessions).values({ userId, personality: p, projectType: project, difficulty: level, mode, scores: result.scores });
  return result;
}

export async function recentSessions(db: DB, userId: string) {
  return db.select().from(s.roleplaySessions).where(eq(s.roleplaySessions.userId, userId)).orderBy(desc(s.roleplaySessions.createdAt)).limit(8);
}
