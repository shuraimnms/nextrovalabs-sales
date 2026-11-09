import type { PgTable } from "drizzle-orm/pg-core";
import { eq, sql } from "drizzle-orm";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { allScripts } from "./scripts";
import { CATEGORIES } from "./types";
import { objections } from "./objections";
import { courses } from "./courses";
import { templates } from "./templates";
import { articles } from "./knowledge";

const approval = (pending?: boolean) => (pending ? "PENDING_ADMIN_CONFIRMATION" : "APPROVED") as "APPROVED" | "PENDING_ADMIN_CONFIRMATION";
const now = () => new Date();

export type SeedSummary = Record<string, number>;

/** Idempotent: inserts missing rows by slug and never overwrites content an admin has edited. */
export async function seedContent(db: DB): Promise<SeedSummary> {
  const out: SeedSummary = {};

  await db.insert(s.companySettings).values({ id: "singleton", tagline: "Software, web, mobile, AI and cloud" }).onConflictDoNothing();

  await db.insert(s.scriptCategories)
    .values(CATEGORIES.map(([slug, name], i) => ({ slug, name, sortOrder: i })))
    .onConflictDoNothing();
  const cats = await db.select().from(s.scriptCategories);
  const catId = new Map(cats.map((c) => [c.slug, c.id]));

  for (let i = 0; i < allScripts.length; i += 50) {
    const rows = allScripts.slice(i, i + 50).map((x) => {
      const categoryId = catId.get(x.category);
      if (!categoryId) throw new Error(`Unknown category ${x.category} for ${x.slug}`);
      return {
        slug: x.slug, title: x.title, categoryId, service: x.service, stage: x.stage, difficulty: x.difficulty,
        language: "HINGLISH" as const, scenario: x.scenario, recommended: x.recommended, alternative: x.alternative,
        englishVersion: x.english, usageGuidance: x.use, thingsToAvoid: x.avoid, status: "PUBLISHED" as const,
        approval: approval(x.pending), publishedAt: now(),
      };
    });
    await db.insert(s.scripts).values(rows).onConflictDoNothing();
  }
  const sc = await db.select({ id: s.scripts.id, slug: s.scripts.slug, v: s.scripts.version, title: s.scripts.title, rec: s.scripts.recommended })
    .from(s.scripts);
  const existingVersions = new Set((await db.select({ id: s.scriptVersions.scriptId }).from(s.scriptVersions)).map((r) => r.id));
  const missing = sc.filter((r) => !existingVersions.has(r.id));
  for (let i = 0; i < missing.length; i += 50) {
    await db.insert(s.scriptVersions).values(missing.slice(i, i + 50).map((r) => ({
      scriptId: r.id, version: r.v, snapshot: { title: r.title, recommended: r.rec }, changeNote: "Initial seed",
    }))).onConflictDoNothing();
  }
  out.scripts = allScripts.length;

  for (const o of objections) {
    const [row] = await db.insert(s.objections).values({
      slug: o.slug, customerSays: o.customerSays, category: o.category, popular: o.popular, whyItWorks: o.why, dontSay: o.dont,
      status: "PUBLISHED", approval: approval(o.pending), publishedAt: now(),
    }).onConflictDoNothing().returning({ id: s.objections.id });
    if (!row) continue;
    await db.insert(s.objectionResponses).values([
      { objectionId: row.id, variant: "RECOMMENDED", body: o.recommended },
      { objectionId: row.id, variant: "SHORT", body: o.short },
      { objectionId: row.id, variant: "DETAILED", body: o.detailed },
      { objectionId: row.id, variant: "ALTERNATIVE", body: o.alternative },
    ]).onConflictDoNothing();
  }
  out.objections = objections.length;

  for (const c of courses) {
    const [row] = await db.insert(s.courses).values({
      slug: c.slug, number: c.number, title: c.title, summary: c.summary, level: c.level, passingScore: c.passing, status: "PUBLISHED",
    }).onConflictDoNothing().returning({ id: s.courses.id });
    if (!row) continue;
    let mOrder = 0;
    for (const m of c.modules) {
      const [mod] = await db.insert(s.modules).values({ courseId: row.id, title: m.title, sortOrder: mOrder++ }).returning({ id: s.modules.id });
      await db.insert(s.lessons).values(m.lessons.map((l, i) => ({
        moduleId: mod.id, title: l.title, type: l.type, body: l.body, minutes: l.minutes, sortOrder: i,
      })));
    }
    const [quiz] = await db.insert(s.quizzes).values({ courseId: row.id, title: `${c.title} — Assessment`, passingScore: c.passing }).returning({ id: s.quizzes.id });
    await db.insert(s.quizQuestions).values(c.questions.map((q, i) => ({
      quizId: quiz.id, prompt: q.prompt, options: q.options, correctIndex: q.correct, explanation: q.why, sortOrder: i,
    })));
  }
  out.courses = courses.length;

  await db.insert(s.whatsappTemplates).values(templates.map((t) => ({
    slug: t.slug, title: t.title, category: t.category, bodyEnglish: t.en, bodyHinglish: t.hi, status: "PUBLISHED" as const, approval: approval(t.pending),
  }))).onConflictDoNothing();
  out.templates = templates.length;

  await db.insert(s.knowledgeArticles).values(articles.map((a) => ({
    slug: a.slug, title: a.title, section: a.section, body: a.body, status: "PUBLISHED" as const, approval: approval(a.pending),
  }))).onConflictDoNothing();
  out.articles = articles.length;

  return out;
}

export async function contentCounts(db: DB) {
  const q = async (t: PgTable) => Number((await db.select({ n: sql<number>`count(*)` }).from(t))[0].n);
  return {
    scripts: await q(s.scripts), objections: await q(s.objections), courses: await q(s.courses), lessons: await q(s.lessons),
    questions: await q(s.quizQuestions), templates: await q(s.whatsappTemplates), articles: await q(s.knowledgeArticles),
  };
}
void eq;
