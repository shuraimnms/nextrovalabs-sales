"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/lib/db";
import * as auth from "@/services/auth.service";
import { clearSessionCookie, clientMeta, COOKIE, getCurrentUser, setSessionCookie, ttlHours } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { homeFor } from "@/lib/permissions";
import { mailConfigured, sendMail } from "@/lib/mail";
import { env } from "@/lib/env";

export type FormState = { error?: string; success?: string } | undefined;

const loginSchema = z.object({ email: z.string().email().max(200), password: z.string().min(1).max(200) });

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const meta = await clientMeta();
  const r = await auth.login(getDb(), { ...parsed.data, ...meta }, ttlHours());
  if (!r.ok) {
    // Deliberately vague for invalid/suspended so the form cannot be used to probe accounts.
    const msg = {
      invalid: "Incorrect email or password.",
      suspended: "This account is not active. Please contact your manager.",
      locked: "Too many failed attempts. Try again in 15 minutes.",
      rate_limited: "Too many attempts. Please wait a few minutes and try again.",
    }[r.reason];
    return { error: msg };
  }
  await setSessionCookie(r.token, r.expiresAt);
  redirect(r.user.mustChangePassword ? "/change-password" : homeFor(r.user.role));
}

export async function logoutAction() {
  const token = (await cookies()).get(COOKIE)?.value;
  await auth.logout(getDb(), token);
  await clearSessionCookie();
  redirect("/login");
}

const emailSchema = z.object({ email: z.string().email().max(200) });
const GENERIC = "If that email belongs to an active account, a reset link has been sent. If email is not set up for your team, ask your manager for a reset link.";

export async function forgotPasswordAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse({ email: form.get("email") });
  if (!parsed.success) return { error: "Enter a valid email address." };
  const { ip } = await clientMeta();
  const { token } = await auth.requestPasswordReset(getDb(), parsed.data.email, ip);
  if (token && mailConfigured()) {
    const link = `${env().APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    await sendMail(parsed.data.email, "Reset your Nextrova Sales OS password", `Use this link within 30 minutes to set a new password:\n\n${link}\n\nIf you did not request this, ignore this email.`);
  }
  return { success: GENERIC }; // identical response whether or not the account exists
}

const resetSchema = z.object({ token: z.string().min(20).max(200), password: z.string().min(1).max(200), confirm: z.string() });

export async function resetPasswordAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({ token: form.get("token"), password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { error: "Please fill in all fields." };
  if (parsed.data.password !== parsed.data.confirm) return { error: "Passwords do not match." };
  const r = await auth.resetPassword(getDb(), parsed.data.token, parsed.data.password);
  if (!r.ok) return { error: r.reason === "weak_password" ? r.message : "This reset link is invalid or has expired. Request a new one." };
  redirect("/login?reset=1");
}

const changeSchema = z.object({ current: z.string().min(1).max(200), password: z.string().min(1).max(200), confirm: z.string() });

export async function changePasswordAction(_: FormState, form: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const parsed = changeSchema.safeParse({ current: form.get("current"), password: form.get("password"), confirm: form.get("confirm") });
  if (!parsed.success) return { error: "Please fill in all fields." };
  if (parsed.data.password !== parsed.data.confirm) return { error: "Passwords do not match." };
  const token = (await cookies()).get(COOKIE)?.value;
  const r = await auth.changePassword(getDb(), user.id, parsed.data.current, parsed.data.password, token);
  if (!r.ok) return { error: r.message };
  redirect(homeFor(user.role));
}
