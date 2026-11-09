import { describe, expect, it } from "vitest";
import { can, canManageTarget, homeFor } from "@/lib/permissions";
import { sanitize } from "@/lib/audit";

describe("permissions", () => {
  it("employees can only read content", () => {
    expect(can("EMPLOYEE", "content:read")).toBe(true);
    for (const p of ["content:write", "users:manage", "audit:read", "analytics:read"] as const) expect(can("EMPLOYEE", p)).toBe(false);
  });
  it("admins cannot read audit logs or manage admins; super admins can", () => {
    expect(can("ADMIN", "audit:read")).toBe(false);
    expect(can("ADMIN", "admins:manage")).toBe(false);
    expect(can("SUPER_ADMIN", "audit:read")).toBe(true);
  });
  it("admins may only manage employees", () => {
    expect(canManageTarget("ADMIN", "EMPLOYEE")).toBe(true);
    expect(canManageTarget("ADMIN", "ADMIN")).toBe(false);
    expect(canManageTarget("ADMIN", "SUPER_ADMIN")).toBe(false);
    expect(canManageTarget("EMPLOYEE", "EMPLOYEE")).toBe(false);
  });
  it("role-based home redirects", () => {
    expect(homeFor("EMPLOYEE")).toBe("/dashboard");
    expect(homeFor("ADMIN")).toBe("/admin/dashboard");
  });
});

describe("audit sanitiser", () => {
  it("redacts secrets at any depth", () => {
    const out = sanitize({ name: "a", password: "x", nested: { apiKey: "k", sessionToken: "t", ok: 1 } }) as { name?: unknown; password?: unknown; nested: { apiKey?: unknown; sessionToken?: unknown; ok: number } };
    expect(out.password).toBe("[redacted]");
    expect(out.nested.apiKey).toBe("[redacted]");
    expect(out.nested.sessionToken).toBe("[redacted]");
    expect(out.nested.ok).toBe(1);
    expect(out.name).toBe("a");
  });
});
