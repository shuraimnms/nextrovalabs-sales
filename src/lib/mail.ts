import "server-only";

/**
 * Mail boundary. Uses Resend's HTTP API when RESEND_API_KEY + MAIL_FROM are configured.
 * When not configured, sending is skipped and `false` is returned, so callers fall back to the
 * admin-issued reset link flow instead of pretending an email was sent.
 */
export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);

export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to, subject, text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
