import type { PgColumn, PgTable } from "drizzle-orm/pg-core";
import { and, asc, count, desc, eq, gte, inArray, isNull, ne, sql, type SQL } from "drizzle-orm";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { audit } from "@/lib/audit";
import { hashPassword, passwordPolicy } from "@/lib/auth/password";
import { canManageTarget, ForbiddenError, type Role } from "@/lib/permissions";
import { issueResetToken, revokeAllSessions } from "@/services/auth.service";

export class ValidationError extends Error { constructor(m: string) { super(m); this.name = "ValidationError"; } }
type Actor = { id: string; role: Role };
type Status = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
const norm = (e: string) => e.trim().toLowerCase();

// ───────────── Employees ─────────────
export async function listUsers(db: DB, actor: Actor) {
  const rows = await db.select({
    id: s.users.id, email: s.users.email, name: s.users.name, role: s.users.role, status: s.users.status, lastLoginAt: s.users.lastLoginAt,
    createdAt: s.users.createdAt, mustChange: s.users.mustChangePassword,
  }).from(s.users).where(isNull(s.users.deletedAt)).orderBy(asc(s.users.name));
  return actor.role === "SUPER_ADMIN" ? rows : rows.filter((r) => r.role === "EMPLOYEE");
}

export async function createUser(db: DB, actor: Actor, input: { email: string; name: string; role: Role; password: string }) {
  if (!canManageTarget(actor.role, input.role)) throw new ForbiddenError();
  const problem = passwordPolicy.check(input.password);
  if (problem) throw new ValidationError(problem);
  const email = norm(input.email);
  const [dup] = await db.select({ id: s.users.id }).from(s.users).where(eq(s.users.email, email)).limit(1);
  if (dup) throw new ValidationError("A user with this email already exists.");
  const [u] = await db.insert(s.users).values({ email, name: input.name.trim(), role: input.role, passwordHash: await hashPassword(input.password), mustChangePassword: true, createdById: actor.id }).returning({ id: s.users.id });
  await audit(db, { actorId: actor.id, action: "user.create", resource: "user", resourceId: u.id, metadata: { role: input.role, email } });
  return u.id;
}

async function target(db: DB, actor: Actor, id: string) {
  const [t] = await db.select().from(s.users).where(and(eq(s.users.id, id), isNull(s.users.deletedAt))).limit(1);
  if (!t) throw new ValidationError("User not found.");
  if (t.id === actor.id) throw new ValidationError("You cannot change your own account here.");
  if (!canManageTarget(actor.role, t.role)) throw new ForbiddenError();
  return t;
}

export async function setUserStatus(db: DB, actor: Actor, id: string, status: "ACTIVE" | "SUSPENDED") {
  const t = await target(db, actor, id);
  await db.update(s.users).set({ status }).where(eq(s.users.id, t.id));
  if (status === "SUSPENDED") await revokeAllSessions(db, t.id);
  await audit(db, { actorId: actor.id, action: `user.${status === "ACTIVE" ? "activate" : "suspend"}`, resource: "user", resourceId: t.id });
}

export async function setUserRole(db: DB, actor: Actor, id: string, role: Role) {
  if (actor.role !== "SUPER_ADMIN") throw new ForbiddenError();
  const t = await target(db, actor, id);
  if (t.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const [{ n }] = await db.select({ n: count() }).from(s.users).where(and(eq(s.users.role, "SUPER_ADMIN"), isNull(s.users.deletedAt)));
    if (Number(n) <= 1) throw new ValidationError("There must be at least one Super Admin.");
  }
  await db.update(s.users).set({ role }).where(eq(s.users.id, t.id));
  await revokeAllSessions(db, t.id);
  await audit(db, { actorId: actor.id, action: "user.role_change", resource: "user", resourceId: t.id, metadata: { from: t.role, to: role } });
}

export async function deleteUser(db: DB, actor: Actor, id: string) {
  const t = await target(db, actor, id);
  await db.update(s.users).set({ deletedAt: new Date(), status: "SUSPENDED" }).where(eq(s.users.id, t.id));
  await revokeAllSessions(db, t.id);
  await audit(db, { actorId: actor.id, action: "user.delete", resource: "user", resourceId: t.id });
}

export async function createResetLink(db: DB, actor: Actor, id: string) {
  const t = await target(db, actor, id);
  return issueResetToken(db, t.id, actor.id);
}

// ───────────── Generic status / soft delete ─────────────
const TABLES = {
  script: s.scripts, objection: s.objections, template: s.whatsappTemplates, article: s.knowledgeArticles, course: s.courses, announcement: s.announcements,
} as const;
export type Entity = keyof typeof TABLES;
// Every content table shares id/status/deletedAt (announcements have no deletedAt/publishedAt in practice); typed loosely only here.
type ContentTable = PgTable & { id: PgColumn };
type Script = typeof s.scripts.$inferSelect;
type Objection = typeof s.objections.$inferSelect;
type Template = typeof s.whatsappTemplates.$inferSelect;
type Announcement = typeof s.announcements.$inferSelect;
type Course = typeof s.courses.$inferSelect;

export async function setStatus(db: DB, actor: Actor, entity: Entity, id: string, status: Status) {
  const t = TABLES[entity] as unknown as ContentTable;
  const set: Record<string, unknown> = { status };
  if (status === "PUBLISHED" && "publishedAt" in t) set.publishedAt = new Date();
  const r = await db.update(t).set(set).where(eq(t.id, id)).returning({ id: t.id });
  if (!r.length) throw new ValidationError("Not found.");
  await audit(db, { actorId: actor.id, action: `${entity}.${status.toLowerCase()}`, resource: entity, resourceId: id });
}

export async function softDelete(db: DB, actor: Actor, entity: Exclude<Entity, "announcement">, id: string) {
  const t = TABLES[entity] as unknown as ContentTable;
  const r = await db.update(t).set({ deletedAt: new Date(), status: "ARCHIVED" }).where(eq(t.id, id)).returning({ id: t.id });
  if (!r.length) throw new ValidationError("Not found.");
  await audit(db, { actorId: actor.id, action: `${entity}.delete`, resource: entity, resourceId: id });
}

export async function deleteAnnouncement(db: DB, actor: Actor, id: string) {
  await db.delete(s.announcements).where(eq(s.announcements.id, id));
  await audit(db, { actorId: actor.id, action: "announcement.delete", resource: "announcement", resourceId: id });
}

// ───────────── Scripts (versioned) ─────────────
export type ScriptInput = {
  title: string; categoryId: string; service: Script["service"]; stage: Script["stage"]; difficulty: Script["difficulty"]; scenario: string; recommended: string; alternative?: string | null;
  englishVersion?: string | null; usageGuidance: string; thingsToAvoid: string; approval: "APPROVED" | "PENDING_ADMIN_CONFIRMATION"; changeNote?: string;
};
const slugify = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);

export async function saveScript(db: DB, actor: Actor, id: string | null, input: ScriptInput) {
  const { changeNote, ...v } = input;
  if (!id) {
    let slug = slugify(v.title) || "script";
    const [dup] = await db.select({ id: s.scripts.id }).from(s.scripts).where(eq(s.scripts.slug, slug)).limit(1);
    if (dup) slug = `${slug}-${Date.now().toString(36)}`;
    const [row] = await db.insert(s.scripts).values({ ...v, slug, authorId: actor.id, status: "DRAFT" }).returning({ id: s.scripts.id });
    await db.insert(s.scriptVersions).values({ scriptId: row.id, version: 1, snapshot: v, changeNote: changeNote || "Created", createdById: actor.id });
    await audit(db, { actorId: actor.id, action: "script.create", resource: "script", resourceId: row.id });
    return row.id;
  }
  const [cur] = await db.select().from(s.scripts).where(eq(s.scripts.id, id)).limit(1);
  if (!cur) throw new ValidationError("Script not found.");
  const version = cur.version + 1;
  await db.update(s.scripts).set({ ...v, version }).where(eq(s.scripts.id, id));
  await db.insert(s.scriptVersions).values({ scriptId: id, version, snapshot: v, changeNote: changeNote || "Edited", createdById: actor.id }).onConflictDoNothing();
  await audit(db, { actorId: actor.id, action: "script.update", resource: "script", resourceId: id, metadata: { version } });
  return id;
}

export async function listScriptVersions(db: DB, scriptId: string) {
  return db.select({ id: s.scriptVersions.id, version: s.scriptVersions.version, changeNote: s.scriptVersions.changeNote, createdAt: s.scriptVersions.createdAt, snapshot: s.scriptVersions.snapshot, by: s.users.name })
    .from(s.scriptVersions).leftJoin(s.users, eq(s.users.id, s.scriptVersions.createdById)).where(eq(s.scriptVersions.scriptId, scriptId)).orderBy(desc(s.scriptVersions.version));
}

export async function restoreScriptVersion(db: DB, actor: Actor, scriptId: string, versionId: string) {
  const [v] = await db.select().from(s.scriptVersions).where(and(eq(s.scriptVersions.id, versionId), eq(s.scriptVersions.scriptId, scriptId))).limit(1);
  if (!v) throw new ValidationError("Version not found.");
  const snap = v.snapshot as Partial<ScriptInput>;
  if (!snap.recommended || !snap.title) throw new ValidationError("This version cannot be restored (incomplete snapshot).");
  const input: ScriptInput = {
    title: snap.title, categoryId: snap.categoryId!, service: snap.service as Script["service"], stage: snap.stage as Script["stage"], difficulty: snap.difficulty as Script["difficulty"], scenario: snap.scenario ?? "", recommended: snap.recommended,
    alternative: snap.alternative ?? null, englishVersion: snap.englishVersion ?? null, usageGuidance: snap.usageGuidance ?? "", thingsToAvoid: snap.thingsToAvoid ?? "",
    approval: snap.approval ?? "APPROVED", changeNote: `Restored version ${v.version}`,
  };
  const [cur] = await db.select({ categoryId: s.scripts.categoryId }).from(s.scripts).where(eq(s.scripts.id, scriptId)).limit(1);
  if (!input.categoryId) input.categoryId = cur.categoryId;
  await saveScript(db, actor, scriptId, input);
  await audit(db, { actorId: actor.id, action: "script.restore", resource: "script", resourceId: scriptId, metadata: { restoredVersion: v.version } });
}

// ───────────── Objections, templates, knowledge, announcements ─────────────
export async function saveObjection(db: DB, actor: Actor, id: string | null, i: { customerSays: string; category: Objection["category"]; popular: boolean; whyItWorks: string; dontSay: string; approval: Script["approval"]; responses: Record<"RECOMMENDED" | "SHORT" | "DETAILED" | "ALTERNATIVE", string> }) {
  const { responses, ...v } = i;
  let oid = id;
  if (!oid) {
    const [r] = await db.insert(s.objections).values({ ...v, slug: `${slugify(v.customerSays)}-${Date.now().toString(36)}`, status: "DRAFT" }).returning({ id: s.objections.id });
    oid = r.id;
  } else {
    const r = await db.update(s.objections).set(v).where(eq(s.objections.id, oid)).returning({ id: s.objections.id });
    if (!r.length) throw new ValidationError("Not found.");
  }
  for (const [variant, body] of Object.entries(responses)) {
    await db.insert(s.objectionResponses).values({ objectionId: oid, variant: variant as typeof s.objectionResponses.$inferSelect["variant"], body }).onConflictDoUpdate({ target: [s.objectionResponses.objectionId, s.objectionResponses.variant], set: { body } });
  }
  await audit(db, { actorId: actor.id, action: id ? "objection.update" : "objection.create", resource: "objection", resourceId: oid });
  return oid;
}

export async function saveTemplate(db: DB, actor: Actor, id: string | null, i: { title: string; category: Template["category"]; bodyEnglish: string; bodyHinglish: string; approval: Script["approval"] }) {
  if (!id) {
    const [r] = await db.insert(s.whatsappTemplates).values({ ...i, slug: `${slugify(i.title)}-${Date.now().toString(36)}`, status: "DRAFT" }).returning({ id: s.whatsappTemplates.id });
    await audit(db, { actorId: actor.id, action: "template.create", resource: "template", resourceId: r.id });
    return r.id;
  }
  const r = await db.update(s.whatsappTemplates).set(i).where(eq(s.whatsappTemplates.id, id)).returning({ id: s.whatsappTemplates.id });
  if (!r.length) throw new ValidationError("Not found.");
  await audit(db, { actorId: actor.id, action: "template.update", resource: "template", resourceId: id });
  return id;
}

export async function saveArticle(db: DB, actor: Actor, id: string | null, i: { title: string; section: string; body: string; approval: Script["approval"] }) {
  if (!id) {
    const [r] = await db.insert(s.knowledgeArticles).values({ ...i, slug: `${slugify(i.title)}-${Date.now().toString(36)}`, status: "DRAFT" }).returning({ id: s.knowledgeArticles.id });
    await audit(db, { actorId: actor.id, action: "article.create", resource: "article", resourceId: r.id });
    return r.id;
  }
  const r = await db.update(s.knowledgeArticles).set(i).where(eq(s.knowledgeArticles.id, id)).returning({ id: s.knowledgeArticles.id });
  if (!r.length) throw new ValidationError("Not found.");
  await audit(db, { actorId: actor.id, action: "article.update", resource: "article", resourceId: id });
  return id;
}

export async function saveAnnouncement(db: DB, actor: Actor, id: string | null, i: { title: string; body: string; priority: Announcement["priority"] }) {
  if (!id) {
    const [r] = await db.insert(s.announcements).values({ ...i, authorId: actor.id, status: "DRAFT" }).returning({ id: s.announcements.id });
    await audit(db, { actorId: actor.id, action: "announcement.create", resource: "announcement", resourceId: r.id });
    return r.id;
  }
  await db.update(s.announcements).set(i).where(eq(s.announcements.id, id));
  await audit(db, { actorId: actor.id, action: "announcement.update", resource: "announcement", resourceId: id });
  return id;
}

// ───────────── Courses ─────────────
export async function saveCourseMeta(db: DB, actor: Actor, id: string, i: { title: string; summary: string; level: Course["level"]; passingScore: number }) {
  const r = await db.update(s.courses).set(i).where(eq(s.courses.id, id)).returning({ id: s.courses.id });
  if (!r.length) throw new ValidationError("Course not found.");
  await db.update(s.quizzes).set({ passingScore: i.passingScore }).where(eq(s.quizzes.courseId, id));
  await audit(db, { actorId: actor.id, action: "course.update", resource: "course", resourceId: id });
}
export async function saveLesson(db: DB, actor: Actor, id: string, i: { title: string; body: string; minutes: number }) {
  const r = await db.update(s.lessons).set(i).where(eq(s.lessons.id, id)).returning({ id: s.lessons.id });
  if (!r.length) throw new ValidationError("Lesson not found.");
  await audit(db, { actorId: actor.id, action: "lesson.update", resource: "lesson", resourceId: id });
}
export async function saveQuestion(db: DB, actor: Actor, id: string, i: { prompt: string; options: string[]; correctIndex: number; explanation: string }) {
  if (i.correctIndex < 0 || i.correctIndex >= i.options.length) throw new ValidationError("Correct answer must be one of the options.");
  const r = await db.update(s.quizQuestions).set(i).where(eq(s.quizQuestions.id, id)).returning({ id: s.quizQuestions.id });
  if (!r.length) throw new ValidationError("Question not found.");
  await audit(db, { actorId: actor.id, action: "question.update", resource: "question", resourceId: id });
}

// ───────────── Dashboards ─────────────
export async function adminOverview(db: DB) {
  const c = async (t: PgTable, where?: SQL) => Number((await db.select({ n: count() }).from(t).where(where))[0].n);
  const [employees, published, drafts, pendingReview, pendingConfirm] = await Promise.all([
    c(s.users, and(eq(s.users.role, "EMPLOYEE"), eq(s.users.status, "ACTIVE"), isNull(s.users.deletedAt))),
    c(s.scripts, and(eq(s.scripts.status, "PUBLISHED"), isNull(s.scripts.deletedAt))),
    c(s.scripts, and(eq(s.scripts.status, "DRAFT"), isNull(s.scripts.deletedAt))),
    c(s.scripts, and(eq(s.scripts.status, "PENDING_REVIEW"), isNull(s.scripts.deletedAt))),
    c(s.scripts, and(eq(s.scripts.approval, "PENDING_ADMIN_CONFIRMATION"), isNull(s.scripts.deletedAt))),
  ]);
  const a = await analytics(db);
  const recent = await db.select({ slug: s.scripts.slug, title: s.scripts.title, updatedAt: s.scripts.updatedAt, status: s.scripts.status }).from(s.scripts).where(isNull(s.scripts.deletedAt)).orderBy(desc(s.scripts.updatedAt)).limit(6);
  const activity = await db.select({ id: s.auditLogs.id, action: s.auditLogs.action, resource: s.auditLogs.resource, at: s.auditLogs.createdAt, actor: s.users.name }).from(s.auditLogs).leftJoin(s.users, eq(s.users.id, s.auditLogs.actorId)).orderBy(desc(s.auditLogs.createdAt)).limit(8);
  const pendingTotal = pendingConfirm
    + (await c(s.objections, and(eq(s.objections.approval, "PENDING_ADMIN_CONFIRMATION"), isNull(s.objections.deletedAt))))
    + (await c(s.whatsappTemplates, and(eq(s.whatsappTemplates.approval, "PENDING_ADMIN_CONFIRMATION"), isNull(s.whatsappTemplates.deletedAt))))
    + (await c(s.knowledgeArticles, and(eq(s.knowledgeArticles.approval, "PENDING_ADMIN_CONFIRMATION"), isNull(s.knowledgeArticles.deletedAt))));
  return { employees, published, drafts, pendingReview, pendingConfirm: pendingTotal, completionPct: a.completionPct, avgQuiz: a.avgQuiz, recent, activity };
}

export async function analytics(db: DB) {
  const [{ emps }] = await db.select({ emps: count() }).from(s.users).where(and(eq(s.users.role, "EMPLOYEE"), eq(s.users.status, "ACTIVE"), isNull(s.users.deletedAt)));
  const [{ lessons }] = await db.select({ lessons: count() }).from(s.lessons);
  const [{ done }] = await db.select({ done: count() }).from(s.lessonProgress).innerJoin(s.users, eq(s.users.id, s.lessonProgress.userId)).where(and(eq(s.users.role, "EMPLOYEE"), isNull(s.users.deletedAt)));
  const completionPct = Number(emps) && Number(lessons) ? Math.round((Number(done) / (Number(emps) * Number(lessons))) * 100) : 0;
  const [q] = await db.select({ avg: sql<number | null>`avg(${s.quizAttempts.scorePct})`, n: count(), passed: sql<number>`count(*) filter (where ${s.quizAttempts.passed})` }).from(s.quizAttempts);
  const since = new Date(Date.now() - 30 * 86400_000);
  const [act] = await db.select({ n: sql<number>`count(distinct ${s.sessions.userId})` }).from(s.sessions).where(gte(s.sessions.lastUsedAt, since));
  const [rp] = await db.select({ n: count(), avg: sql<number | null>`avg((${s.roleplaySessions.scores}->>'overall')::numeric)` }).from(s.roleplaySessions);
  const [certs] = await db.select({ n: count() }).from(s.certificates);
  const perCourse = await db.select({ title: s.courses.title, number: s.courses.number, attempts: count(s.quizAttempts.id), avg: sql<number | null>`avg(${s.quizAttempts.scorePct})`, certs: sql<number>`(select count(*) from certificates c where c.course_id = ${s.courses.id})` })
    .from(s.courses).leftJoin(s.quizzes, eq(s.quizzes.courseId, s.courses.id)).leftJoin(s.quizAttempts, eq(s.quizAttempts.quizId, s.quizzes.id)).where(isNull(s.courses.deletedAt)).groupBy(s.courses.id).orderBy(asc(s.courses.number));
  const favs = await db.select({ title: s.scripts.title, n: count() }).from(s.scriptFavorites).innerJoin(s.scripts, eq(s.scripts.id, s.scriptFavorites.scriptId)).groupBy(s.scripts.id).orderBy(desc(count())).limit(5);
  return {
    activeEmployees: Number(emps), completionPct, avgQuiz: q.avg == null ? null : Math.round(Number(q.avg)), quizAttempts: Number(q.n), quizPassRate: Number(q.n) ? Math.round((Number(q.passed) / Number(q.n)) * 100) : null,
    activeLast30: Number(act.n), roleplays: Number(rp.n), roleplayAvg: rp.avg == null ? null : Math.round(Number(rp.avg)), certificates: Number(certs.n),
    perCourse: perCourse.map((p) => ({ ...p, avg: p.avg == null ? null : Math.round(Number(p.avg)), attempts: Number(p.attempts), certs: Number(p.certs) })),
    topFavorites: favs.map((f) => ({ title: f.title, n: Number(f.n) })),
  };
}

export async function auditPage(db: DB, page: number, size = 30) {
  const rows = await db.select({ id: s.auditLogs.id, action: s.auditLogs.action, resource: s.auditLogs.resource, resourceId: s.auditLogs.resourceId, metadata: s.auditLogs.metadata, at: s.auditLogs.createdAt, actor: s.users.name, actorEmail: s.users.email })
    .from(s.auditLogs).leftJoin(s.users, eq(s.users.id, s.auditLogs.actorId)).orderBy(desc(s.auditLogs.createdAt)).limit(size).offset((page - 1) * size);
  const [{ n }] = await db.select({ n: count() }).from(s.auditLogs);
  return { rows, total: Number(n) };
}
void ne; void inArray;
