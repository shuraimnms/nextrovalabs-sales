import { and, asc, count, desc, eq, ilike, inArray, isNull, or, sql, type SQL } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";

import type { PgColumn } from "drizzle-orm/pg-core";
type Script = typeof s.scripts.$inferSelect;
type Objection = typeof s.objections.$inferSelect;
type Template = typeof s.whatsappTemplates.$inferSelect;
const published = (t: { status: PgColumn; deletedAt: PgColumn }) => and(eq(t.status, "PUBLISHED"), isNull(t.deletedAt));
const like = (q: string) => `%${q.replace(/[%_\\]/g, (m) => "\\" + m)}%`;

// ───────────── Scripts ─────────────
export type ScriptFilters = {
  q?: string; service?: string; stage?: string; category?: string; difficulty?: string; onlyFavorites?: boolean; limit?: number; offset?: number;
};

export async function listScripts(db: DB, userId: string, f: ScriptFilters = {}) {
  const conds: (SQL | undefined)[] = [published(s.scripts)];
  if (f.q?.trim()) {
    const p = like(f.q.trim());
    conds.push(or(ilike(s.scripts.title, p), ilike(s.scripts.scenario, p), ilike(s.scripts.recommended, p), ilike(s.scripts.alternative, p)));
  }
  if (f.service) conds.push(eq(s.scripts.service, f.service as Script["service"]));
  if (f.stage) conds.push(eq(s.scripts.stage, f.stage as NonNullable<Script["stage"]>));
  if (f.difficulty) conds.push(eq(s.scripts.difficulty, f.difficulty as Script["difficulty"]));
  if (f.category) conds.push(eq(s.scriptCategories.slug, f.category));
  if (f.onlyFavorites) conds.push(sql`${s.scriptFavorites.userId} is not null`);
  const where = and(...conds);
  const base = db
    .select({
      id: s.scripts.id, slug: s.scripts.slug, title: s.scripts.title, scenario: s.scripts.scenario, service: s.scripts.service,
      stage: s.scripts.stage, difficulty: s.scripts.difficulty, approval: s.scripts.approval, updatedAt: s.scripts.updatedAt,
      category: s.scriptCategories.name, categorySlug: s.scriptCategories.slug,
      favorite: sql<boolean>`${s.scriptFavorites.userId} is not null`,
    })
    .from(s.scripts)
    .innerJoin(s.scriptCategories, eq(s.scriptCategories.id, s.scripts.categoryId))
    .leftJoin(s.scriptFavorites, and(eq(s.scriptFavorites.scriptId, s.scripts.id), eq(s.scriptFavorites.userId, userId)))
    .where(where);
  const limit = Math.min(f.limit ?? 24, 100);
  const rows = await base.orderBy(asc(s.scriptCategories.sortOrder), asc(s.scripts.title)).limit(limit).offset(f.offset ?? 0);
  const [{ n }] = await db
    .select({ n: count() }).from(s.scripts)
    .innerJoin(s.scriptCategories, eq(s.scriptCategories.id, s.scripts.categoryId))
    .leftJoin(s.scriptFavorites, and(eq(s.scriptFavorites.scriptId, s.scripts.id), eq(s.scriptFavorites.userId, userId)))
    .where(where);
  return { rows, total: Number(n) };
}

export async function getScript(db: DB, userId: string, slug: string) {
  const [r] = await db
    .select({ script: s.scripts, category: s.scriptCategories.name, favorite: sql<boolean>`${s.scriptFavorites.userId} is not null` })
    .from(s.scripts)
    .innerJoin(s.scriptCategories, eq(s.scriptCategories.id, s.scripts.categoryId))
    .leftJoin(s.scriptFavorites, and(eq(s.scriptFavorites.scriptId, s.scripts.id), eq(s.scriptFavorites.userId, userId)))
    .where(and(eq(s.scripts.slug, slug), published(s.scripts)))
    .limit(1);
  return r ?? null;
}

/** Scripts for the Live Call Companion — full text so the client can navigate without extra round-trips. */
export async function scriptsForCall(db: DB, userId: string, service: string, stage: string) {
  const svc = service === "GENERAL" ? undefined : or(eq(s.scripts.service, service as Script["service"]), eq(s.scripts.service, "GENERAL"));
  return db
    .select({
      id: s.scripts.id, slug: s.scripts.slug, title: s.scripts.title, scenario: s.scripts.scenario, recommended: s.scripts.recommended,
      alternative: s.scripts.alternative, usage: s.scripts.usageGuidance, avoid: s.scripts.thingsToAvoid, approval: s.scripts.approval,
      favorite: sql<boolean>`${s.scriptFavorites.userId} is not null`,
    })
    .from(s.scripts)
    .leftJoin(s.scriptFavorites, and(eq(s.scriptFavorites.scriptId, s.scripts.id), eq(s.scriptFavorites.userId, userId)))
    .where(and(published(s.scripts), eq(s.scripts.stage, stage as NonNullable<Script["stage"]>), svc))
    .orderBy(asc(s.scripts.difficulty), asc(s.scripts.title))
    .limit(30);
}

export async function toggleFavorite(db: DB, userId: string, kind: "script" | "objection", id: string) {
  if (kind === "script") {
    const del = await db.delete(s.scriptFavorites).where(and(eq(s.scriptFavorites.userId, userId), eq(s.scriptFavorites.scriptId, id))).returning();
    if (del.length) return false;
    await db.insert(s.scriptFavorites).values({ userId, scriptId: id }).onConflictDoNothing();
    return true;
  }
  const del = await db.delete(s.objectionFavorites).where(and(eq(s.objectionFavorites.userId, userId), eq(s.objectionFavorites.objectionId, id))).returning();
  if (del.length) return false;
  await db.insert(s.objectionFavorites).values({ userId, objectionId: id }).onConflictDoNothing();
  return true;
}

// ───────────── Objections ─────────────
export async function listObjections(db: DB, userId: string, f: { q?: string; category?: string; onlyFavorites?: boolean; popular?: boolean } = {}) {
  const conds: (SQL | undefined)[] = [published(s.objections)];
  if (f.q?.trim()) conds.push(or(ilike(s.objections.customerSays, like(f.q.trim())), ilike(s.objections.whyItWorks, like(f.q.trim()))));
  if (f.category) conds.push(eq(s.objections.category, f.category as Objection["category"]));
  if (f.popular) conds.push(eq(s.objections.popular, true));
  if (f.onlyFavorites) conds.push(sql`${s.objectionFavorites.userId} is not null`);
  const rows = await db
    .select({
      id: s.objections.id, slug: s.objections.slug, customerSays: s.objections.customerSays, category: s.objections.category,
      popular: s.objections.popular, approval: s.objections.approval, whyItWorks: s.objections.whyItWorks, dontSay: s.objections.dontSay,
      favorite: sql<boolean>`${s.objectionFavorites.userId} is not null`,
    })
    .from(s.objections)
    .leftJoin(s.objectionFavorites, and(eq(s.objectionFavorites.objectionId, s.objections.id), eq(s.objectionFavorites.userId, userId)))
    .where(and(...conds))
    .orderBy(desc(s.objections.popular), asc(s.objections.customerSays));
  if (!rows.length) return [];
  const resp = await db.select().from(s.objectionResponses).where(inArray(s.objectionResponses.objectionId, rows.map((r) => r.id)));
  return rows.map((r) => ({
    ...r,
    responses: Object.fromEntries(resp.filter((x) => x.objectionId === r.id).map((x) => [x.variant, x.body])) as Record<"RECOMMENDED" | "SHORT" | "DETAILED" | "ALTERNATIVE", string>,
  }));
}

// ───────────── Templates & Knowledge ─────────────
export async function listTemplates(db: DB, f: { q?: string; category?: string } = {}) {
  const conds: (SQL | undefined)[] = [published(s.whatsappTemplates)];
  if (f.category) conds.push(eq(s.whatsappTemplates.category, f.category as Template["category"]));
  if (f.q?.trim()) { const p = like(f.q.trim()); conds.push(or(ilike(s.whatsappTemplates.title, p), ilike(s.whatsappTemplates.bodyEnglish, p), ilike(s.whatsappTemplates.bodyHinglish, p))); }
  return db.select().from(s.whatsappTemplates).where(and(...conds)).orderBy(asc(s.whatsappTemplates.category), asc(s.whatsappTemplates.title));
}

export async function listArticles(db: DB, f: { q?: string; section?: string } = {}) {
  const conds: (SQL | undefined)[] = [published(s.knowledgeArticles)];
  if (f.section) conds.push(eq(s.knowledgeArticles.section, f.section));
  if (f.q?.trim()) { const p = like(f.q.trim()); conds.push(or(ilike(s.knowledgeArticles.title, p), ilike(s.knowledgeArticles.body, p))); }
  return db.select().from(s.knowledgeArticles).where(and(...conds)).orderBy(asc(s.knowledgeArticles.section), asc(s.knowledgeArticles.title));
}

export async function getArticle(db: DB, slug: string) {
  const [a] = await db.select().from(s.knowledgeArticles).where(and(eq(s.knowledgeArticles.slug, slug), published(s.knowledgeArticles))).limit(1);
  return a ?? null;
}

// ───────────── Academy ─────────────
export async function listCourses(db: DB, userId: string) {
  const cs = await db.select().from(s.courses).where(published(s.courses)).orderBy(asc(s.courses.number));
  const lessonRows = await db
    .select({ courseId: s.modules.courseId, lessonId: s.lessons.id, minutes: s.lessons.minutes })
    .from(s.lessons).innerJoin(s.modules, eq(s.modules.id, s.lessons.moduleId));
  const done = await db.select({ lessonId: s.lessonProgress.lessonId }).from(s.lessonProgress).where(eq(s.lessonProgress.userId, userId));
  const doneSet = new Set(done.map((d) => d.lessonId));
  const certs = await db.select({ courseId: s.certificates.courseId }).from(s.certificates).where(eq(s.certificates.userId, userId));
  const certSet = new Set(certs.map((c) => c.courseId));
  return cs.map((c) => {
    const ls = lessonRows.filter((l) => l.courseId === c.id);
    const completed = ls.filter((l) => doneSet.has(l.lessonId)).length;
    return { ...c, lessonCount: ls.length, completed, minutes: ls.reduce((n, l) => n + l.minutes, 0), pct: ls.length ? Math.round((completed / ls.length) * 100) : 0, certified: certSet.has(c.id) };
  });
}

export async function getCourse(db: DB, userId: string, slug: string) {
  const [c] = await db.select().from(s.courses).where(and(eq(s.courses.slug, slug), published(s.courses))).limit(1);
  if (!c) return null;
  const mods = await db.select().from(s.modules).where(eq(s.modules.courseId, c.id)).orderBy(asc(s.modules.sortOrder));
  const ls = mods.length ? await db.select().from(s.lessons).where(inArray(s.lessons.moduleId, mods.map((m) => m.id))).orderBy(asc(s.lessons.sortOrder)) : [];
  const done = await db.select({ lessonId: s.lessonProgress.lessonId }).from(s.lessonProgress).where(eq(s.lessonProgress.userId, userId));
  const doneSet = new Set(done.map((d) => d.lessonId));
  const [quiz] = await db.select().from(s.quizzes).where(eq(s.quizzes.courseId, c.id)).limit(1);
  const [cert] = await db.select().from(s.certificates).where(and(eq(s.certificates.userId, userId), eq(s.certificates.courseId, c.id))).limit(1);
  const attempts = quiz ? await db.select().from(s.quizAttempts).where(and(eq(s.quizAttempts.userId, userId), eq(s.quizAttempts.quizId, quiz.id))).orderBy(desc(s.quizAttempts.createdAt)).limit(5) : [];
  const modules = mods.map((m) => ({ ...m, lessons: ls.filter((l) => l.moduleId === m.id).map((l) => ({ ...l, done: doneSet.has(l.id) })) }));
  const all = modules.flatMap((m) => m.lessons);
  return { course: c, modules, quiz: quiz ?? null, certificate: cert ?? null, attempts, completed: all.filter((l) => l.done).length, total: all.length };
}

export async function completeLesson(db: DB, userId: string, lessonId: string) {
  const [l] = await db.select({ id: s.lessons.id }).from(s.lessons)
    .innerJoin(s.modules, eq(s.modules.id, s.lessons.moduleId))
    .innerJoin(s.courses, eq(s.courses.id, s.modules.courseId))
    .where(and(eq(s.lessons.id, lessonId), published(s.courses))).limit(1);
  if (!l) return false;
  await db.insert(s.lessonProgress).values({ userId, lessonId }).onConflictDoNothing();
  return true;
}

export async function getQuiz(db: DB, courseSlug: string) {
  const [c] = await db.select().from(s.courses).where(and(eq(s.courses.slug, courseSlug), published(s.courses))).limit(1);
  if (!c) return null;
  const [quiz] = await db.select().from(s.quizzes).where(eq(s.quizzes.courseId, c.id)).limit(1);
  if (!quiz) return null;
  // The correct answers are NOT sent to the client; grading happens on the server.
  const qs = await db.select({ id: s.quizQuestions.id, prompt: s.quizQuestions.prompt, options: s.quizQuestions.options }).from(s.quizQuestions)
    .where(eq(s.quizQuestions.quizId, quiz.id)).orderBy(asc(s.quizQuestions.sortOrder));
  return { course: c, quiz, questions: qs };
}

export async function submitQuiz(db: DB, userId: string, quizId: string, answers: Record<string, number>) {
  const qs = await db.select().from(s.quizQuestions).where(eq(s.quizQuestions.quizId, quizId)).orderBy(asc(s.quizQuestions.sortOrder));
  const [quiz] = await db.select().from(s.quizzes).where(eq(s.quizzes.id, quizId)).limit(1);
  if (!quiz || !qs.length) throw new Error("Quiz not found");
  const review = qs.map((q) => ({ id: q.id, prompt: q.prompt, chosen: answers[q.id] ?? -1, correct: q.correctIndex, ok: answers[q.id] === q.correctIndex, explanation: q.explanation, options: q.options }));
  const scorePct = Math.round((review.filter((r) => r.ok).length / qs.length) * 100);
  const passed = scorePct >= quiz.passingScore;
  await db.insert(s.quizAttempts).values({ userId, quizId, scorePct, passed, answers });
  let certificateCode: string | null = null;
  if (passed) {
    const [{ total, done }] = await db
      .select({ total: count(s.lessons.id), done: count(s.lessonProgress.lessonId) })
      .from(s.lessons)
      .innerJoin(s.modules, eq(s.modules.id, s.lessons.moduleId))
      .leftJoin(s.lessonProgress, and(eq(s.lessonProgress.lessonId, s.lessons.id), eq(s.lessonProgress.userId, userId)))
      .where(eq(s.modules.courseId, quiz.courseId));
    if (Number(done) >= Number(total)) {
      const code = `NSOS-${randomBytes(5).toString("hex").toUpperCase()}`;
      await db.insert(s.certificates).values({ userId, courseId: quiz.courseId, code }).onConflictDoNothing();
      const [cert] = await db.select().from(s.certificates).where(and(eq(s.certificates.userId, userId), eq(s.certificates.courseId, quiz.courseId))).limit(1);
      certificateCode = cert?.code ?? null;
    }
  }
  return { scorePct, passed, review, certificateCode, passingScore: quiz.passingScore };
}

export async function getCertificate(db: DB, userId: string, code: string) {
  const [r] = await db
    .select({ code: s.certificates.code, issuedAt: s.certificates.issuedAt, course: s.courses.title, name: s.users.name, level: s.courses.level })
    .from(s.certificates)
    .innerJoin(s.courses, eq(s.courses.id, s.certificates.courseId))
    .innerJoin(s.users, eq(s.users.id, s.certificates.userId))
    .where(and(eq(s.certificates.code, code), eq(s.certificates.userId, userId))).limit(1);
  return r ?? null;
}

// ───────────── Global search ─────────────
export async function globalSearch(db: DB, q: string) {
  const term = q.trim();
  if (term.length < 2) return [] as { type: string; title: string; subtitle: string; href: string }[];
  const p = like(term);
  const [sc, ob, tp, kb, co] = await Promise.all([
    db.select({ slug: s.scripts.slug, title: s.scripts.title, scenario: s.scripts.scenario }).from(s.scripts)
      .where(and(published(s.scripts), or(ilike(s.scripts.title, p), ilike(s.scripts.scenario, p), ilike(s.scripts.recommended, p)))).limit(5),
    db.select({ slug: s.objections.slug, title: s.objections.customerSays }).from(s.objections).where(and(published(s.objections), ilike(s.objections.customerSays, p))).limit(5),
    db.select({ slug: s.whatsappTemplates.slug, title: s.whatsappTemplates.title }).from(s.whatsappTemplates).where(and(published(s.whatsappTemplates), or(ilike(s.whatsappTemplates.title, p), ilike(s.whatsappTemplates.bodyEnglish, p)))).limit(4),
    db.select({ slug: s.knowledgeArticles.slug, title: s.knowledgeArticles.title, section: s.knowledgeArticles.section }).from(s.knowledgeArticles).where(and(published(s.knowledgeArticles), or(ilike(s.knowledgeArticles.title, p), ilike(s.knowledgeArticles.body, p)))).limit(5),
    db.select({ slug: s.courses.slug, title: s.courses.title }).from(s.courses).where(and(published(s.courses), or(ilike(s.courses.title, p), ilike(s.courses.summary, p)))).limit(3),
  ]);
  return [
    ...sc.map((x) => ({ type: "Script", title: x.title, subtitle: x.scenario.slice(0, 80), href: `/scripts/${x.slug}` })),
    ...ob.map((x) => ({ type: "Objection", title: x.title, subtitle: "Objection Center", href: `/objections?q=${encodeURIComponent(x.title)}` })),
    ...tp.map((x) => ({ type: "Template", title: x.title, subtitle: "WhatsApp template", href: `/templates?q=${encodeURIComponent(x.title)}` })),
    ...kb.map((x) => ({ type: "Knowledge", title: x.title, subtitle: x.section, href: `/knowledge/${x.slug}` })),
    ...co.map((x) => ({ type: "Course", title: x.title, subtitle: "Academy", href: `/academy/${x.slug}` })),
  ];
}

// ───────────── Dashboard (only real data) ─────────────
export async function employeeDashboard(db: DB, userId: string) {
  const courses = await listCourses(db, userId);
  const favScripts = await db
    .select({ slug: s.scripts.slug, title: s.scripts.title, scenario: s.scripts.scenario })
    .from(s.scriptFavorites).innerJoin(s.scripts, eq(s.scripts.id, s.scriptFavorites.scriptId))
    .where(and(eq(s.scriptFavorites.userId, userId), isNull(s.scripts.deletedAt))).orderBy(desc(s.scriptFavorites.createdAt)).limit(5);
  const announcements = await db.select().from(s.announcements).where(eq(s.announcements.status, "PUBLISHED")).orderBy(desc(s.announcements.publishedAt)).limit(3);
  const recent = await db.select({ slug: s.scripts.slug, title: s.scripts.title, updatedAt: s.scripts.updatedAt }).from(s.scripts).where(published(s.scripts)).orderBy(desc(s.scripts.updatedAt)).limit(5);
  const featured = await db.select({ slug: s.knowledgeArticles.slug, title: s.knowledgeArticles.title, section: s.knowledgeArticles.section }).from(s.knowledgeArticles).where(published(s.knowledgeArticles)).orderBy(desc(s.knowledgeArticles.updatedAt)).limit(4);
  const [sessionsN] = await db.select({ n: count() }).from(s.roleplaySessions).where(eq(s.roleplaySessions.userId, userId));
  const [attemptsN] = await db.select({ n: count() }).from(s.quizAttempts).where(eq(s.quizAttempts.userId, userId));
  const inProgress = courses.find((c) => c.pct > 0 && c.pct < 100) ?? courses.find((c) => c.pct === 0) ?? null;
  const totalLessons = courses.reduce((n, c) => n + c.lessonCount, 0);
  const doneLessons = courses.reduce((n, c) => n + c.completed, 0);
  return { courses, favScripts, announcements, recent, featured, inProgress, overallPct: totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0, certificates: courses.filter((c) => c.certified).length, roleplayCount: Number(sessionsN.n), quizAttempts: Number(attemptsN.n) };
}
