import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/lib/db";
import * as auth from "@/services/auth.service";
import { assertCan, ForbiddenError, homeFor, isAdmin, type Permission } from "@/lib/permissions";
import { env } from "@/lib/env";

// "__Host-" prefix forces Secure + Path=/ + no Domain in browsers; fall back to a plain name on http://localhost.
const secure = process.env.NODE_ENV === "production";
export const COOKIE = secure ? "__Host-nsos_session" : "nsos_session";

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure, sameSite: "lax", path: "/", expires: expiresAt });
}
export async function clearSessionCookie() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0 });
}

/** Per-request memoised: layouts and pages share one DB lookup. */
export const getCurrentUser = cache(async (): Promise<auth.SessionUser | null> => {
  const token = (await cookies()).get(COOKIE)?.value;
  return auth.validateSession(getDb(), token);
});

export async function requireUser(): Promise<auth.SessionUser> {
  const u = await getCurrentUser();
  if (!u) redirect("/login");
  if (u.mustChangePassword) redirect("/change-password");
  return u;
}

/** For pages (admin area). Employees are sent to their own home; the API/actions variant throws instead. */
export async function requirePageAdmin(permission: Permission = "content:write") {
  const u = await requireUser();
  if (!isAdmin(u.role)) redirect(homeFor(u.role));
  try { assertCan(u.role, permission); } catch { redirect("/admin/dashboard"); }
  return u;
}

/** For server actions and route handlers: authorises independently of any page/proxy check. */
export async function requireActionUser(permission?: Permission) {
  const u = await getCurrentUser();
  if (!u) throw new auth.UnauthorizedErrorShim();
  if (permission) assertCan(u.role, permission);
  return u;
}
export { ForbiddenError };

export async function clientMeta() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return { ip, userAgent: h.get("user-agent") ?? undefined };
}
export const ttlHours = () => env().SESSION_TTL_HOURS;
