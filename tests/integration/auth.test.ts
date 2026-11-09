import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb } from "@/lib/db/test-db";
import type { DB } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import * as auth from "@/services/auth.service";

let db: DB;
const PW = "Str0ngPassw0rd!";

async function mkUser(email: string, over: Partial<typeof users.$inferInsert> = {}) {
  const [u] = await db.insert(users).values({ email, name: "T", passwordHash: await hashPassword(PW), mustChangePassword: false, ...over }).returning();
  return u;
}

beforeAll(async () => { db = await createTestDb(); });

describe("auth service", () => {
  it("logs in with valid credentials and validates the session", async () => {
    await mkUser("ok@x.in");
    const r = await auth.login(db, { email: "OK@x.in", password: PW });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect((await auth.validateSession(db, r.token))?.email).toBe("ok@x.in");
  });

  it("rejects invalid password and unknown account with the same reason", async () => {
    await mkUser("bad@x.in");
    expect(await auth.login(db, { email: "bad@x.in", password: "nope" })).toEqual({ ok: false, reason: "invalid" });
    expect(await auth.login(db, { email: "ghost@x.in", password: "nope" })).toEqual({ ok: false, reason: "invalid" });
  });

  it("locks the account after repeated failures", async () => {
    await mkUser("lock@x.in");
    for (let i = 0; i < auth.MAX_FAILED; i++) await auth.login(db, { email: "lock@x.in", password: "wrong", ip: `1.1.1.${i}` });
    const r = await auth.login(db, { email: "lock@x.in", password: PW, ip: "9.9.9.9" });
    expect(r).toEqual({ ok: false, reason: "locked" });
  });

  it("rate limits login attempts per email", async () => {
    let last: auth.LoginResult | undefined;
    for (let i = 0; i < 12; i++) last = await auth.login(db, { email: "rl@x.in", password: "x", ip: `2.2.2.${i}` });
    expect(last).toEqual({ ok: false, reason: "rate_limited" });
  });

  it("suspended users cannot log in, and existing sessions die immediately", async () => {
    const u = await mkUser("sus@x.in");
    const r = await auth.login(db, { email: "sus@x.in", password: PW });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    await db.update(users).set({ status: "SUSPENDED" }).where(eq(users.id, u.id));
    expect(await auth.validateSession(db, r.token)).toBeNull();
    expect(await auth.login(db, { email: "sus@x.in", password: PW })).toEqual({ ok: false, reason: "suspended" });
    await db.update(users).set({ status: "ACTIVE" }).where(eq(users.id, u.id)); // reactivation
    expect((await auth.login(db, { email: "sus@x.in", password: PW })).ok).toBe(true);
  });

  it("expired sessions are rejected and logout destroys the session", async () => {
    await mkUser("exp@x.in");
    const r = await auth.login(db, { email: "exp@x.in", password: PW }, 0); // ttl 0h => already expired
    if (!r.ok) throw new Error("login failed");
    expect(await auth.validateSession(db, r.token)).toBeNull();
    const r2 = await auth.login(db, { email: "exp@x.in", password: PW });
    if (!r2.ok) throw new Error("login failed");
    await auth.logout(db, r2.token);
    expect(await auth.validateSession(db, r2.token)).toBeNull();
  });

  it("password reset tokens are single-use, and old sessions are revoked", async () => {
    await mkUser("rst@x.in");
    const s = await auth.login(db, { email: "rst@x.in", password: PW });
    if (!s.ok) throw new Error("login failed");
    const { token } = await auth.requestPasswordReset(db, "rst@x.in");
    expect(token).toBeTruthy();
    expect(await auth.resetPassword(db, token!, "weak")).toMatchObject({ ok: false, reason: "weak_password" });
    expect(await auth.resetPassword(db, token!, "N3wStrongPass!")).toEqual({ ok: true });
    expect(await auth.resetPassword(db, token!, "An0therStrong!")).toMatchObject({ ok: false, reason: "invalid_token" });
    expect(await auth.validateSession(db, s.token)).toBeNull();
    expect((await auth.login(db, { email: "rst@x.in", password: "N3wStrongPass!" })).ok).toBe(true);
  });

  it("concurrent reset attempts: exactly one wins", async () => {
    await mkUser("race@x.in");
    const { token } = await auth.requestPasswordReset(db, "race@x.in");
    const results = await Promise.all([1, 2, 3, 4].map(() => auth.resetPassword(db, token!, "N3wStrongPass!")));
    expect(results.filter((r) => r.ok)).toHaveLength(1);
  });

  it("unknown email on reset request yields no token (no enumeration signal besides absence)", async () => {
    expect((await auth.requestPasswordReset(db, "nobody@x.in")).token).toBeNull();
  });

  it("bootstrap works once, then is permanently disabled", async () => {
    await auth.bootstrapSuperAdmin(db, { email: "root@x.in", name: "Root", password: PW });
    await expect(auth.bootstrapSuperAdmin(db, { email: "root2@x.in", name: "R2", password: PW })).rejects.toThrow(/already exists/);
  });
});
