export type Role = "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE";

export type Permission =
  | "content:read"
  | "content:write"
  | "content:publish"
  | "users:read"
  | "users:manage"
  | "admins:manage"
  | "analytics:read"
  | "audit:read"
  | "settings:manage"
  | "announcements:publish";

const MATRIX: Record<Role, readonly Permission[]> = {
  EMPLOYEE: ["content:read"],
  ADMIN: [
    "content:read", "content:write", "content:publish",
    "users:read", "users:manage", "analytics:read", "announcements:publish",
  ],
  SUPER_ADMIN: [
    "content:read", "content:write", "content:publish",
    "users:read", "users:manage", "admins:manage", "analytics:read",
    "audit:read", "settings:manage", "announcements:publish",
  ],
};

export const can = (role: Role, p: Permission) => MATRIX[role].includes(p);
export const isAdmin = (role: Role) => role === "ADMIN" || role === "SUPER_ADMIN";

/** Admins may only manage employees; only Super Admins may touch admin-level accounts. */
export function canManageTarget(actor: Role, target: Role): boolean {
  if (actor === "SUPER_ADMIN") return true;
  return actor === "ADMIN" && target === "EMPLOYEE";
}

export function homeFor(role: Role) {
  return isAdmin(role) ? "/admin/dashboard" : "/dashboard";
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") { super(message); this.name = "ForbiddenError"; }
}
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") { super(message); this.name = "UnauthorizedError"; }
}

export function assertCan(role: Role, p: Permission) {
  if (!can(role, p)) throw new ForbiddenError();
}
