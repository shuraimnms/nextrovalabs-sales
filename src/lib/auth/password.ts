import "server-only";
import argon2 from "argon2";
import crypto from "node:crypto";

// Argon2id with OWASP-recommended minimums (19 MiB, t=2, p=1).
const OPTS = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;

export const hashPassword = (plain: string) => argon2.hash(plain, OPTS);

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}

/** A real hash verified against when the account does not exist, to equalise timing. */
let dummy: string | undefined;
export async function dummyVerify(plain: string) {
  dummy ??= await argon2.hash(crypto.randomBytes(16).toString("hex"), OPTS);
  await verifyPassword(dummy, plain);
}

export const passwordPolicy = {
  min: 10,
  check(pw: string): string | null {
    if (pw.length < this.min) return `Password must be at least ${this.min} characters.`;
    if (pw.length > 128) return "Password is too long.";
    if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw)) return "Use upper-case, lower-case and a number.";
    return null;
  },
};
