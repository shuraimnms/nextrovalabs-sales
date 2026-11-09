import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "@/lib/db/test-db";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { seedContent, contentCounts } from "@/content/seed";
import * as c from "@/services/content.service";

let db: DB;
let uid: string;
beforeAll(async () => {
  db = await createTestDb();
  await seedContent(db);
  [{ id: uid }] = await db.insert(s.users).values({ email: "e@x.in", name: "Emp", passwordHash: "x", role: "EMPLOYEE" }).returning({ id: s.users.id });
});

describe("seed content", () => {
  it("meets the minimum content volumes", async () => {
    const n = await contentCounts(db);
    expect(n.scripts).toBeGreaterThanOrEqual(100);
    expect(n.objections).toBeGreaterThanOrEqual(60);
    expect(n.courses).toBe(12);
    expect(n.templates).toBeGreaterThanOrEqual(30);
    expect(n.articles).toBeGreaterThanOrEqual(40);
  });
  it("is idempotent", async () => {
    const before = await contentCounts(db);
    await seedContent(db);
    expect(await contentCounts(db)).toEqual(before);
  });
  it("gives every objection four response variants", async () => {
    const rows = await db.select().from(s.objectionResponses);
    const o = await db.select().from(s.objections);
    expect(rows.length).toBe(o.length * 4);
  });
  it("never contains invented prices or guarantees in published scripts", async () => {
    const rows = await db.select({ t: s.scripts.recommended, a: s.scripts.alternative }).from(s.scripts);
    for (const r of rows) expect(`${r.t} ${r.a}`).not.toMatch(/(₹|rs\.?)\s*\d|\b100\s*%\s*guarantee/i);
  });
});

describe("scripts", () => {
  it("lists, filters, searches and paginates", async () => {
    const all = await c.listScripts(db, uid, { limit: 10 });
    expect(all.rows).toHaveLength(10);
    expect(all.total).toBeGreaterThanOrEqual(100);
    const web = await c.listScripts(db, uid, { service: "WEBSITE", limit: 100 });
    expect(web.rows.every((r) => r.service === "WEBSITE")).toBe(true);
    const q = await c.listScripts(db, uid, { q: "missed call" });
    expect(q.total).toBeGreaterThan(0);
  });
  it("treats LIKE wildcards in search as literal text", async () => {
    expect((await c.listScripts(db, uid, { q: "%" })).total).toBe(0);
  });
  it("toggles favourites per user", async () => {
    const [sc] = (await c.listScripts(db, uid, { limit: 1 })).rows;
    expect(await c.toggleFavorite(db, uid, "script", sc.id)).toBe(true);
    expect((await c.listScripts(db, uid, { onlyFavorites: true })).total).toBe(1);
    expect(await c.toggleFavorite(db, uid, "script", sc.id)).toBe(false);
    expect((await c.listScripts(db, uid, { onlyFavorites: true })).total).toBe(0);
  });
  it("hides drafts and deleted scripts from employees", async () => {
    const [sc] = (await c.listScripts(db, uid, { limit: 1 })).rows;
    await db.update(s.scripts).set({ status: "DRAFT" }).where(eq(s.scripts.id, sc.id));
    expect(await c.getScript(db, uid, sc.slug)).toBeNull();
    await db.update(s.scripts).set({ status: "PUBLISHED" }).where(eq(s.scripts.id, sc.id));
    expect(await c.getScript(db, uid, sc.slug)).not.toBeNull();
  });
  it("returns call scripts for a stage including General ones", async () => {
    const r = await c.scriptsForCall(db, uid, "WEBSITE", "OPENING");
    expect(r.length).toBeGreaterThan(0);
  });
});

describe("objections, templates, knowledge, search", () => {
  it("returns objections with their responses", async () => {
    const r = await c.listObjections(db, uid, { category: "PRICE" });
    expect(r.length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(r[0].responses).sort()).toEqual(["ALTERNATIVE", "DETAILED", "RECOMMENDED", "SHORT"]);
  });
  it("covers all 12 template categories with Hinglish and English bodies", async () => {
    const t = await c.listTemplates(db);
    expect(new Set(t.map((x) => x.category)).size).toBe(12);
    expect(t.every((x) => x.bodyEnglish && x.bodyHinglish)).toBe(true);
  });
  it("covers all 13 knowledge sections", async () => {
    const a = await c.listArticles(db);
    expect(new Set(a.map((x) => x.section)).size).toBe(13);
  });
  it("global search finds across types and ignores short queries", async () => {
    expect(await c.globalSearch(db, "a")).toEqual([]);
    const hits = await c.globalSearch(db, "price");
    expect(new Set(hits.map((h) => h.type)).size).toBeGreaterThan(1);
  });
});

describe("academy", () => {
  it("tracks progress and issues a certificate only after all lessons AND a pass", async () => {
    const [course] = await db.select().from(s.courses).where(eq(s.courses.number, 1));
    const d = await c.getCourse(db, uid, course.slug);
    const quiz = await c.getQuiz(db, course.slug);
    expect(quiz!.questions[0]).not.toHaveProperty("correctIndex"); // answers never sent to the client
    const key = await db.select().from(s.quizQuestions).where(eq(s.quizQuestions.quizId, quiz!.quiz.id));
    const perfect = Object.fromEntries(key.map((k) => [k.id, k.correctIndex]));

    const early = await c.submitQuiz(db, uid, quiz!.quiz.id, perfect);
    expect(early.passed).toBe(true);
    expect(early.certificateCode).toBeNull(); // lessons not done yet

    for (const l of d!.modules.flatMap((m) => m.lessons)) expect(await c.completeLesson(db, uid, l.id)).toBe(true);
    const failing = await c.submitQuiz(db, uid, quiz!.quiz.id, Object.fromEntries(key.map((k) => [k.id, (k.correctIndex + 1) % k.options.length])));
    expect(failing.passed).toBe(false);
    expect(failing.certificateCode).toBeNull();

    const ok = await c.submitQuiz(db, uid, quiz!.quiz.id, perfect);
    expect(ok.certificateCode).toMatch(/^NSOS-[0-9A-F]{10}$/);
    const again = await c.submitQuiz(db, uid, quiz!.quiz.id, perfect);
    expect(again.certificateCode).toBe(ok.certificateCode); // one certificate per course
    expect(await c.getCertificate(db, uid, ok.certificateCode!)).not.toBeNull();
  });
  it("does not let one user read another's certificate", async () => {
    const [other] = await db.insert(s.users).values({ email: "o@x.in", name: "Other", passwordHash: "x" }).returning({ id: s.users.id });
    const [cert] = await db.select().from(s.certificates);
    expect(await c.getCertificate(db, other.id, cert.code)).toBeNull();
  });
  it("ignores unknown lesson ids", async () => {
    expect(await c.completeLesson(db, uid, "00000000-0000-0000-0000-000000000000")).toBe(false);
  });
  it("computes dashboard figures from real rows", async () => {
    const d = await c.employeeDashboard(db, uid);
    expect(d.certificates).toBe(1);
    expect(d.quizAttempts).toBeGreaterThanOrEqual(3);
    expect(d.overallPct).toBeGreaterThan(0);
  });
});
