import { and, eq, gt, isNull } from "drizzle-orm";
import { passwordResetTokens, sessions, users } from "@/lib/db/schema";
import type { DB } from "@/lib/db";
import { dummyVerify, hashPassword, passwordPolicy, verifyPassword } from "@/lib/auth/password";
import { hashToken, newToken } from "@/lib/auth/tokens";
import { hit, reset } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";
import { hashToken as h } from "@/lib/auth/tokens";
import { UnauthorizedError } from "@/lib/permissions";
export { UnauthorizedError as UnauthorizedErrorShim };

export const MAX_FAILED = 5;
export const LOCK_MINUTES = 15;
export const RESET_TTL_MINUTES = 30;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE";
  mustChangePassword: boolean;
};

export type LoginResult =
  | { ok: true; token: string; expiresAt: Date; user: SessionUser }
  | { ok: false; reason: "invalid" | "rate_limited" | "suspended" | "locked" };

const normEmail = (e: string) => e.trim().toLowerCase();

export async function login(
  db: DB,
  input: { email: string; password: string; ip?: string; userAgent?: string },
  ttlHours = 12,
): Promise<LoginResult> {
  const email = normEmail(input.email);
  // Two independent throttles: per account and per source IP.
  const [byEmail, byIp] = await Promise.all([
    hit(db, `login:e:${h(email)}`, 10, 15 * 60),
    hit(db, `login:i:${h(input.ip ?? "unknown")}`, 30, 15 * 60),
  ]);
  if (!byEmail.allowed || !byIp.allowed) return { ok: false, reason: "rate_limited" };

  const [u] = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);
  if (!u) {
    await dummyVerify(input.password); // equalise timing; do not reveal whether the account exists
    return { ok: false, reason: "invalid" };
  }
  if (u.lockedUntil && u.lockedUntil > new Date()) return { ok: false, reason: "locked" };

  const valid = await verifyPassword(u.passwordHash, input.password);
  if (!valid) {
    const failed = u.failedLoginCount + 1;
    await db
      .update(users)
      .set({
        failedLoginCount: failed >= MAX_FAILED ? 0 : failed,
        lockedUntil: failed >= MAX_FAILED ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      })
      .where(eq(users.id, u.id));
    if (failed >= MAX_FAILED) await audit(db, { actorId: null, action: "auth.account_locked", resource: "user", resourceId: u.id });
    return { ok: false, reason: "invalid" };
  }
  // Suspension is checked only after the password is proven, so it cannot be used to enumerate accounts.
  if (u.status === "SUSPENDED") return { ok: false, reason: "suspended" };

  const token = newToken();
  const expiresAt = new Date(Date.now() + ttlHours * 3600_000);
  await db.insert(sessions).values({ userId: u.id, tokenHash: hashToken(token), expiresAt, userAgent: input.userAgent?.slice(0, 300) });
  await db.update(users).set({ failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() }).where(eq(users.id, u.id));
  await reset(db, `login:e:${h(email)}`);
  await audit(db, { actorId: u.id, action: "auth.login", resource: "user", resourceId: u.id });
  return { ok: true, token, expiresAt, user: { id: u.id, email: u.email, name: u.name, role: u.role, mustChangePassword: u.mustChangePassword } };
}

/** Resolves a cookie token to a user. Re-checks status on EVERY request so suspension is immediate. */
export async function validateSession(db: DB, token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  const [row] = await db
    .select({
      sid: sessions.id,
      id: users.id, email: users.email, name: users.name, role: users.role,
      status: users.status, deletedAt: users.deletedAt, mustChangePassword: users.mustChangePassword,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!row || row.status !== "ACTIVE" || row.deletedAt) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role, mustChangePassword: row.mustChangePassword };
}

export async function logout(db: DB, token: string | undefined) {
  if (token) await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
}

export async function revokeAllSessions(db: DB, userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

/**
 * Always resolves the same way whether or not the email exists (no enumeration).
 * Returns the raw token only when an account matched, so the caller can deliver it by a trusted channel.
 */
export async function requestPasswordReset(db: DB, emailRaw: string, ip?: string): Promise<{ token: string | null; userId: string | null }> {
  const email = normEmail(emailRaw);
  const [a, b] = await Promise.all([hit(db, `reset:e:${h(email)}`, 3, 3600), hit(db, `reset:i:${h(ip ?? "unknown")}`, 20, 3600)]);
  if (!a.allowed || !b.allowed) return { token: null, userId: null };
  const [u] = await db.select().from(users).where(and(eq(users.email, email), eq(users.status, "ACTIVE"), isNull(users.deletedAt))).limit(1);
  if (!u) return { token: null, userId: null };
  return { token: await issueResetToken(db, u.id, u.id), userId: u.id };
}

/** Used by admins ("Trigger password reset") and by self-service requests. */
export async function issueResetToken(db: DB, userId: string, actorId: string): Promise<string> {
  // Invalidate earlier unused tokens so only the newest link works.
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(and(eq(passwordResetTokens.userId, userId), isNull(passwordResetTokens.usedAt)));
  const token = newToken();
  await db.insert(passwordResetTokens).values({ userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60_000) });
  await audit(db, { actorId, action: "auth.reset_requested", resource: "user", resourceId: userId });
  return token;
}

export type ResetResult = { ok: true } | { ok: false; reason: "invalid_token" | "weak_password"; message?: string };

export async function resetPassword(db: DB, token: string, newPassword: string): Promise<ResetResult> {
  const problem = passwordPolicy.check(newPassword);
  if (problem) return { ok: false, reason: "weak_password", message: problem };
  const passwordHash = await hashPassword(newPassword);
  // Single atomic claim: only one concurrent request can flip usedAt from NULL, making the token single-use.
  const claimed = await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResetTokens.tokenHash, hashToken(token)), isNull(passwordResetTokens.usedAt), gt(passwordResetTokens.expiresAt, new Date())))
    .returning({ userId: passwordResetTokens.userId });
  const row = claimed[0];
  if (!row) return { ok: false, reason: "invalid_token" };
  await db.update(users).set({ passwordHash, mustChangePassword: false, failedLoginCount: 0, lockedUntil: null }).where(eq(users.id, row.userId));
  await revokeAllSessions(db, row.userId);
  await audit(db, { actorId: row.userId, action: "auth.password_reset", resource: "user", resourceId: row.userId });
  return { ok: true };
}

export async function changePassword(
  db: DB,
  userId: string,
  current: string,
  next: string,
  keepToken?: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const problem = passwordPolicy.check(next);
  if (problem) return { ok: false, message: problem };
  const [u] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!u || !(await verifyPassword(u.passwordHash, current))) return { ok: false, message: "Current password is incorrect." };
  if (current === next) return { ok: false, message: "New password must be different." };
  await db.update(users).set({ passwordHash: await hashPassword(next), mustChangePassword: false }).where(eq(users.id, userId));
  // Sign out every other device; keep the current session alive.
  const all = await db.select().from(sessions).where(eq(sessions.userId, userId));
  for (const s of all) if (!keepToken || s.tokenHash !== hashToken(keepToken)) await db.delete(sessions).where(eq(sessions.id, s.id));
  await audit(db, { actorId: userId, action: "auth.password_changed", resource: "user", resourceId: userId });
  return { ok: true };
}

/**
 * One-time Super Admin bootstrap. Refuses to run if ANY super admin already exists, so it cannot be used
 * as a backdoor after setup. Credentials come from the operator at run time — nothing is hardcoded.
 */
export async function bootstrapSuperAdmin(db: DB, input: { email: string; name: string; password: string }) {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.role, "SUPER_ADMIN")).limit(1);
  if (existing.length) throw new Error("A Super Admin already exists. Bootstrap is disabled.");
  const problem = passwordPolicy.check(input.password);
  if (problem) throw new Error(problem);
  const [u] = await db
    .insert(users)
    .values({ email: normEmail(input.email), name: input.name, passwordHash: await hashPassword(input.password), role: "SUPER_ADMIN", mustChangePassword: false })
    .returning({ id: users.id });
  await audit(db, { actorId: u.id, action: "auth.bootstrap_super_admin", resource: "user", resourceId: u.id });
  return u.id;
}
