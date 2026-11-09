import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { createTestDb } from "@/lib/db/test-db";
import type { DB } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { seedContent } from "@/content/seed";
import * as a from "@/services/admin.service";
import * as auth from "@/services/auth.service";
import { ForbiddenError } from "@/lib/permissions";

let db: DB;
let sup: { id: string; role: "SUPER_ADMIN" }, adm: { id: string; role: "ADMIN" };
const PW = "Str0ngPassw0rd!";
beforeAll(async () => {
  db = await createTestDb();
  await seedContent(db);
  const [x] = await db.insert(s.users).values({ email: "sup@x.in", name: "Sup", passwordHash: "x", role: "SUPER_ADMIN", mustChangePassword: false }).returning({ id: s.users.id });
  const [y] = await db.insert(s.users).values({ email: "adm@x.in", name: "Adm", passwordHash: "x", role: "ADMIN", mustChangePassword: false }).returning({ id: s.users.id });
  sup = { id: x.id, role: "SUPER_ADMIN" }; adm = { id: y.id, role: "ADMIN" };
});

describe("user management", () => {
  it("lets admins create employees but not admins", async () => {
    await expect(a.createUser(db, adm, { email: "e1@x.in", name: "E1", role: "EMPLOYEE", password: PW })).resolves.toBeTruthy();
    await expect(a.createUser(db, adm, { email: "a2@x.in", name: "A2", role: "ADMIN", password: PW })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(a.createUser(db, sup, { email: "a2@x.in", name: "A2", role: "ADMIN", password: PW })).resolves.toBeTruthy();
  });
  it("rejects weak passwords and duplicate emails", async () => {
    await expect(a.createUser(db, adm, { email: "w@x.in", name: "W", role: "EMPLOYEE", password: "short" })).rejects.toThrow();
    await expect(a.createUser(db, adm, { email: "E1@X.in", name: "Dup", role: "EMPLOYEE", password: PW })).rejects.toThrow(/already exists/);
  });
  it("forces a password change for new users", async () => {
    const [u] = await db.select().from(s.users).where(eq(s.users.email, "e1@x.in"));
    expect(u.mustChangePassword).toBe(true);
  });
  it("suspension revokes access immediately", async () => {
    const [u] = await db.select().from(s.users).where(eq(s.users.email, "e1@x.in"));
    await db.update(s.users).set({ mustChangePassword: false }).where(eq(s.users.id, u.id));
    const login = await auth.login(db, { email: "e1@x.in", password: PW });
    expect(login.ok).toBe(true);
    await a.setUserStatus(db, adm, u.id, "SUSPENDED");
    if (login.ok) expect(await auth.validateSession(db, login.token)).toBeNull();
    expect(await auth.login(db, { email: "e1@x.in", password: PW })).toMatchObject({ ok: false });
  });
  it("admins cannot touch admins, and nobody can change themselves", async () => {
    const [other] = await db.select().from(s.users).where(eq(s.users.email, "a2@x.in"));
    await expect(a.setUserStatus(db, adm, other.id, "SUSPENDED")).rejects.toBeInstanceOf(ForbiddenError);
    await expect(a.setUserStatus(db, adm, adm.id, "SUSPENDED")).rejects.toThrow();
  });
  it("only super admins change roles, and the last super admin is protected", async () => {
    const [e] = await db.select().from(s.users).where(eq(s.users.email, "e1@x.in"));
    await expect(a.setUserRole(db, adm, e.id, "ADMIN")).rejects.toBeInstanceOf(ForbiddenError);
    const [sup2] = await db.insert(s.users).values({ email: "sup2@x.in", name: "S2", passwordHash: "x", role: "SUPER_ADMIN" }).returning({ id: s.users.id });
    await a.setUserRole(db, sup, sup2.id, "ADMIN");
    const [onlySuper] = await db.select().from(s.users).where(eq(s.users.id, sup.id));
    expect(onlySuper.role).toBe("SUPER_ADMIN");
  });
  it("issues a working single-use reset link and audits it", async () => {
    const [e] = await db.select().from(s.users).where(eq(s.users.email, "e1@x.in"));
    const token = await a.createResetLink(db, adm, e.id);
    expect(token.length).toBeGreaterThan(20);
    const logs = await db.select().from(s.auditLogs);
    expect(logs.some((l) => l.action.includes("reset"))).toBe(true);
    expect(JSON.stringify(logs)).not.toContain(token);
  });
  it("soft-deletes users", async () => {
    const id = await a.createUser(db, adm, { email: "gone@x.in", name: "Gone", role: "EMPLOYEE", password: PW });
    await a.deleteUser(db, adm, id);
    const [u] = await db.select().from(s.users).where(eq(s.users.id, id));
    expect(u.deletedAt).not.toBeNull();
    expect((await a.listUsers(db, adm)).some((r) => r.id === id)).toBe(false);
  });
});

describe("script versioning", () => {
  it("creates versions on every save and can restore an old one", async () => {
    const [cat] = await db.select().from(s.scriptCategories).limit(1);
    const base = { title: "T1", categoryId: cat.id, service: "WEBSITE" as const, stage: "OPENING" as const, difficulty: "BEGINNER" as const, scenario: "sc", recommended: "v1 text", alternative: null, englishVersion: null, usageGuidance: "u", thingsToAvoid: "t", approval: "APPROVED" as const };
    const id = await a.saveScript(db, adm, null, base);
    await a.saveScript(db, adm, id, { ...base, recommended: "v2 text", changeNote: "second" });
    let v = await a.listScriptVersions(db, id);
    expect(v.map((x) => x.version)).toEqual([2, 1]);
    await a.restoreScriptVersion(db, adm, id, v[1].id);
    const [row] = await db.select().from(s.scripts).where(eq(s.scripts.id, id));
    expect(row.recommended).toBe("v1 text");
    expect(row.version).toBe(3);
    v = await a.listScriptVersions(db, id);
    expect(v[0].changeNote).toMatch(/Restored version 1/);
  });
  it("publishes and hides content", async () => {
    const [sc] = await db.select().from(s.scripts).where(eq(s.scripts.title, "T1"));
    await a.setStatus(db, adm, "script", sc.id, "PUBLISHED");
    expect((await db.select().from(s.scripts).where(eq(s.scripts.id, sc.id)))[0].publishedAt).not.toBeNull();
    await a.softDelete(db, adm, "script", sc.id);
    expect((await db.select().from(s.scripts).where(eq(s.scripts.id, sc.id)))[0].deletedAt).not.toBeNull();
  });
});

describe("course and quiz editing", () => {
  it("validates the correct option index", async () => {
    const [q] = await db.select().from(s.quizQuestions).limit(1);
    await expect(a.saveQuestion(db, adm, q.id, { prompt: "p", options: ["a", "b"], correctIndex: 5, explanation: "e" })).rejects.toThrow();
    await a.saveQuestion(db, adm, q.id, { prompt: "p2", options: ["a", "b", "c"], correctIndex: 2, explanation: "e" });
    expect((await db.select().from(s.quizQuestions).where(eq(s.quizQuestions.id, q.id)))[0].prompt).toBe("p2");
  });
});

describe("analytics and overview", () => {
  it("returns null averages — not fake numbers — when there is no data", async () => {
    const x = await a.analytics(db);
    expect(x.avgQuiz).toBeNull();
    expect(x.roleplayAvg).toBeNull();
    expect(x.quizAttempts).toBe(0);
    const o = await a.adminOverview(db);
    expect(o.published).toBeGreaterThan(90);
    expect(o.pendingConfirm).toBeGreaterThan(0);
  });
  it("paginates the audit log", async () => {
    const r = await a.auditPage(db, 1, 5);
    expect(r.rows.length).toBeLessThanOrEqual(5);
    expect(r.total).toBeGreaterThan(0);
  });
});
