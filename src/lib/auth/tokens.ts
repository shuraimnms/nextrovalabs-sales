import crypto from "node:crypto";

/** 256-bit opaque token (what goes in the cookie / reset link). */
export const newToken = () => crypto.randomBytes(32).toString("base64url");
/** Only the hash is stored, so a DB leak cannot be replayed as a session. */
export const hashToken = (t: string) => crypto.createHash("sha256").update(t).digest("hex");
