"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hit } from "@/lib/rate-limit";
import { getDb } from "@/lib/db";
import { requireActionUser } from "@/lib/auth/session";
import { completeLesson, submitQuiz, toggleFavorite } from "@/services/content.service";
import * as s from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const uuid = z.string().uuid();

export async function toggleFavoriteAction(kind: "script" | "objection", id: string): Promise<{ ok: boolean; favorite?: boolean }> {
  const u = await requireActionUser();
  if (!uuid.safeParse(id).success || (kind !== "script" && kind !== "objection")) return { ok: false };
  const favorite = await toggleFavorite(getDb(), u.id, kind, id);
  revalidatePath("/dashboard");
  return { ok: true, favorite };
}

export async function completeLessonAction(lessonId: string, courseSlug: string): Promise<{ ok: boolean }> {
  const u = await requireActionUser();
  if (!uuid.safeParse(lessonId).success) return { ok: false };
  const ok = await completeLesson(getDb(), u.id, lessonId);
  revalidatePath(`/academy/${courseSlug}`);
  revalidatePath("/academy");
  revalidatePath("/dashboard");
  return { ok };
}

const quizSchema = z.object({ quizId: uuid, answers: z.record(z.string(), z.number().int().min(0).max(10)) });
export async function submitQuizAction(input: unknown) {
  const u = await requireActionUser();
  const p = quizSchema.safeParse(input);
  if (!p.success) return { ok: false as const, error: "Invalid submission" };
  try {
    const result = await submitQuiz(getDb(), u.id, p.data.quizId, p.data.answers);
    revalidatePath("/academy");
    revalidatePath("/dashboard");
    return { ok: true as const, ...result };
  } catch {
    return { ok: false as const, error: "Quiz not found" };
  }
}

const settingsSchema = z.object({ scriptTextSize: z.number().int().min(14).max(40), displayName: z.string().trim().max(80).optional() });
export async function saveSettingsAction(input: unknown) {
  const u = await requireActionUser();
  const p = settingsSchema.safeParse(input);
  if (!p.success) return { ok: false as const, error: "Invalid settings" };
  const db = getDb();
  await db.insert(s.userSettings).values({ userId: u.id, scriptTextSize: p.data.scriptTextSize, displayName: p.data.displayName || null })
    .onConflictDoUpdate({ target: s.userSettings.userId, set: { scriptTextSize: p.data.scriptTextSize, displayName: p.data.displayName || null } });
  revalidatePath("/settings");
  void eq;
  return { ok: true as const };
}

import { scriptsForCall } from "@/services/content.service";
import { SERVICES, STAGES } from "@/lib/labels";
export async function loadCallScriptsAction(service: string, stage: string) {
  const u = await requireActionUser();
  if (!(service in SERVICES) || !(stage in STAGES)) return { ok: false as const, scripts: [] };
  return { ok: true as const, scripts: await scriptsForCall(getDb(), u.id, service, stage) };
}

import { PERSONALITIES, PROJECTS, openingLine, type Level, type PersonalityKey, type ProjectKey } from "@/lib/roleplay/engine";
import { aiAvailable, finishSession, nextCustomerTurn } from "@/services/roleplay.service";

const rpSchema = z.object({
  personality: z.enum(Object.keys(PERSONALITIES) as [PersonalityKey, ...PersonalityKey[]]),
  project: z.enum(Object.keys(PROJECTS) as [ProjectKey, ...ProjectKey[]]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  history: z.array(z.object({ role: z.enum(["user", "customer"]), text: z.string().max(1500) })).max(20),
  mode: z.enum(["RULE_BASED", "AI"]).optional(),
});

export async function roleplayStartAction(input: unknown) {
  await requireActionUser();
  const p = rpSchema.omit({ history: true, mode: true }).safeParse(input);
  if (!p.success) return { ok: false as const, error: "Invalid selection" };
  return { ok: true as const, opening: openingLine(p.data.personality, p.data.project), aiAvailable: aiAvailable() };
}

export async function roleplayTurnAction(input: unknown) {
  const u = await requireActionUser();
  // Each turn may call a paid AI provider: cap per-user usage (60 turns / 10 min is ample for real practice).
  const rl = await hit(getDb(), `roleplay:${u.id}`, 60, 600);
  if (!rl.allowed) return { ok: false as const, error: "You are practising very quickly. Please wait a few minutes and try again." };
  const p = rpSchema.safeParse(input);
  if (!p.success) return { ok: false as const, error: "Invalid conversation" };
  const r = await nextCustomerTurn(p.data.personality, p.data.project, p.data.level as Level, p.data.history);
  return { ok: true as const, ...r };
}

export async function roleplayFinishAction(input: unknown) {
  const u = await requireActionUser();
  const p = rpSchema.safeParse(input);
  if (!p.success || !p.data.history.some((t) => t.role === "user")) return { ok: false as const, error: "Say something before finishing" };
  const r = await finishSession(getDb(), u.id, p.data.personality, p.data.project, p.data.level as Level, p.data.mode ?? "RULE_BASED", p.data.history);
  revalidatePath("/dashboard");
  revalidatePath("/roleplay");
  return { ok: true as const, ...r };
}
