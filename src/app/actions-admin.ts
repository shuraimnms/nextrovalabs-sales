"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireActionUser } from "@/lib/auth/session";
import { ForbiddenError, type Permission, type Role } from "@/lib/permissions";
import * as admin from "@/services/admin.service";
import { clientMeta } from "@/lib/auth/session";

type Res<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function run<T extends object>(permission: Permission, paths: string[], fn: (actor: { id: string; role: Role }) => Promise<T>): Promise<Res<T>> {
  try {
    const u = await requireActionUser(permission);
    const out = await fn({ id: u.id, role: u.role });
    for (const p of paths) revalidatePath(p);
    return { ok: true, ...out };
  } catch (e) {
    if (e instanceof admin.ValidationError) return { ok: false, error: e.message };
    if (e instanceof ForbiddenError) return { ok: false, error: "You do not have permission to do that." };
    if (e instanceof Error && e.name === "UnauthorizedError") return { ok: false, error: "Your session has expired. Please sign in again." };
    console.error("admin action failed", e instanceof Error ? e.message : e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

const id = z.string().uuid();
const str = (max: number, min = 1) => z.string().trim().min(min).max(max);
const approval = z.enum(["APPROVED", "PENDING_ADMIN_CONFIRMATION"]);
const parse = <T extends z.ZodTypeAny>(schema: T, v: unknown): z.infer<T> => {
  const r = schema.safeParse(v);
  if (!r.success) throw new admin.ValidationError(r.error.issues[0]?.message ? `${r.error.issues[0].path.join(".") || "Input"}: ${r.error.issues[0].message}` : "Invalid input.");
  return r.data;
};

// ── Status / delete (generic) ──
const entity = z.enum(["script", "objection", "template", "article", "course", "announcement"]);
export async function setStatusAction(e: string, rowId: string, status: string) {
  return run("content:publish", ["/admin", "/scripts", "/objections", "/templates", "/knowledge", "/academy", "/dashboard"], async (a) => {
    await admin.setStatus(getDb(), a, parse(entity, e), parse(id, rowId), parse(z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]), status)); return {};
  });
}
export async function deleteEntityAction(e: string, rowId: string) {
  return run("content:write", ["/admin", "/scripts", "/objections", "/templates", "/knowledge", "/academy"], async (a) => {
    const ent = parse(entity, e);
    if (ent === "announcement") await admin.deleteAnnouncement(getDb(), a, parse(id, rowId));
    else await admin.softDelete(getDb(), a, ent, parse(id, rowId));
    return {};
  });
}

// ── Scripts ──
const scriptSchema = z.object({
  title: str(160), categoryId: id, service: z.enum(["WEBSITE", "MOBILE_APP", "ECOMMERCE", "CUSTOM_SOFTWARE", "GENERAL"]),
  stage: z.string().optional().transform((v) => (v ? v : null)).pipe(z.enum(["OPENING", "PERMISSION_TO_SPEAK", "REQUIREMENT_DISCOVERY", "BUSINESS_UNDERSTANDING", "FEATURE_DISCUSSION", "BUDGET_DISCUSSION", "TIMELINE_DISCUSSION", "COMPANY_INTRODUCTION", "OBJECTION_HANDLING", "MEETING_SCHEDULING", "CALL_CLOSING"]).nullable()),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]), scenario: str(600), recommended: str(4000), alternative: z.string().trim().max(4000).optional().transform((v) => v || null),
  englishVersion: z.string().trim().max(4000).optional().transform((v) => v || null), usageGuidance: str(2000), thingsToAvoid: str(2000), approval, changeNote: z.string().trim().max(200).optional(),
});
export async function saveScriptAction(rowId: string | null, values: unknown) {
  return run("content:write", ["/admin/scripts", "/scripts"], async (a) => ({ id: await admin.saveScript(getDb(), a, rowId ? parse(id, rowId) : null, parse(scriptSchema, values)) }));
}
export async function restoreScriptVersionAction(scriptId: string, versionId: string) {
  return run("content:write", ["/admin/scripts", "/scripts"], async (a) => { await admin.restoreScriptVersion(getDb(), a, parse(id, scriptId), parse(id, versionId)); return {}; });
}

// ── Objections ──
const objSchema = z.object({
  customerSays: str(200), category: z.enum(["PRICE", "COMPETITION", "URGENCY", "UNCERTAINTY", "TRUST", "TECHNICAL", "DELAY", "FOLLOW_UP", "PROCESS"]), popular: z.boolean(),
  whyItWorks: str(1000), dontSay: str(1000), approval,
  RECOMMENDED: str(3000), SHORT: str(1500), DETAILED: str(4000), ALTERNATIVE: str(3000),
});
export async function saveObjectionAction(rowId: string | null, values: unknown) {
  return run("content:write", ["/admin/objections", "/objections"], async (a) => {
    const { RECOMMENDED, SHORT, DETAILED, ALTERNATIVE, ...rest } = parse(objSchema, values);
    return { id: await admin.saveObjection(getDb(), a, rowId ? parse(id, rowId) : null, { ...rest, responses: { RECOMMENDED, SHORT, DETAILED, ALTERNATIVE } }) };
  });
}

// ── Templates ──
const tplSchema = z.object({
  title: str(120), category: z.enum(["FIRST_INTRODUCTION", "COMPANY_INTRODUCTION", "WEBSITE_ENQUIRY_FOLLOWUP", "APP_DEVELOPMENT_FOLLOWUP", "REQUIREMENTS_REQUEST", "REFERENCE_WEBSITE_REQUEST", "PROPOSAL_FOLLOWUP", "MEETING_CONFIRMATION", "MEETING_REMINDER", "THANK_YOU", "NOT_INTERESTED", "RECONNECTION"]),
  bodyEnglish: str(2000), bodyHinglish: str(2000), approval,
});
export async function saveTemplateAction(rowId: string | null, values: unknown) {
  return run("content:write", ["/admin/templates", "/templates"], async (a) => ({ id: await admin.saveTemplate(getDb(), a, rowId ? parse(id, rowId) : null, parse(tplSchema, values)) }));
}

// ── Knowledge ──
const artSchema = z.object({ title: str(160), section: str(80), body: str(8000), approval });
export async function saveArticleAction(rowId: string | null, values: unknown) {
  return run("content:write", ["/admin/knowledge", "/knowledge"], async (a) => ({ id: await admin.saveArticle(getDb(), a, rowId ? parse(id, rowId) : null, parse(artSchema, values)) }));
}

// ── Announcements ──
const annSchema = z.object({ title: str(160), body: str(3000), priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]) });
export async function saveAnnouncementAction(rowId: string | null, values: unknown) {
  return run("announcements:publish", ["/admin/announcements", "/dashboard"], async (a) => ({ id: await admin.saveAnnouncement(getDb(), a, rowId ? parse(id, rowId) : null, parse(annSchema, values)) }));
}

// ── Courses ──
const courseSchema = z.object({ title: str(160), summary: str(600), level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]), passingScore: z.coerce.number().int().min(1).max(100) });
export async function saveCourseAction(rowId: string, values: unknown) {
  return run("content:write", ["/admin/courses", "/academy"], async (a) => { await admin.saveCourseMeta(getDb(), a, parse(id, rowId), parse(courseSchema, values)); return {}; });
}
const lessonSchema = z.object({ title: str(160), body: str(10000), minutes: z.coerce.number().int().min(1).max(120) });
export async function saveLessonAction(rowId: string, values: unknown) {
  return run("content:write", ["/admin/courses", "/academy"], async (a) => { await admin.saveLesson(getDb(), a, parse(id, rowId), parse(lessonSchema, values)); return {}; });
}
const qSchema = z.object({ prompt: str(500), options: z.array(str(300)).min(2).max(6), correctIndex: z.coerce.number().int().min(0).max(5), explanation: str(800) });
export async function saveQuestionAction(rowId: string, values: unknown) {
  return run("content:write", ["/admin/courses", "/academy"], async (a) => { await admin.saveQuestion(getDb(), a, parse(id, rowId), parse(qSchema, values)); return {}; });
}

// ── Employees ──
const userSchema = z.object({ email: z.string().trim().email().max(200), name: str(100), role: z.enum(["EMPLOYEE", "ADMIN", "SUPER_ADMIN"]), password: z.string().min(10).max(128) });
export async function createUserAction(values: unknown) {
  return run("users:manage", ["/admin/employees"], async (a) => ({ id: await admin.createUser(getDb(), a, parse(userSchema, values)) }));
}
export async function setUserStatusAction(userId: string, status: string) {
  return run("users:manage", ["/admin/employees"], async (a) => { await admin.setUserStatus(getDb(), a, parse(id, userId), parse(z.enum(["ACTIVE", "SUSPENDED"]), status)); return {}; });
}
export async function setUserRoleAction(userId: string, role: string) {
  return run("admins:manage", ["/admin/employees"], async (a) => { await admin.setUserRole(getDb(), a, parse(id, userId), parse(z.enum(["EMPLOYEE", "ADMIN", "SUPER_ADMIN"]), role)); return {}; });
}
export async function deleteUserAction(userId: string) {
  return run("users:manage", ["/admin/employees"], async (a) => { await admin.deleteUser(getDb(), a, parse(id, userId)); return {}; });
}
export async function createResetLinkAction(userId: string) {
  return run("users:manage", [], async (a) => {
    const token = await admin.createResetLink(getDb(), a, parse(id, userId));
    const base = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
    void clientMeta;
    return { link: `${base}/reset-password?token=${token}` };
  });
}
