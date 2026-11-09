import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/shared/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordAction } from "@/app/actions-auth";

export const metadata: Metadata = { title: "Set new password" };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <Card><CardHeader><CardTitle>Link missing</CardTitle><CardDescription>This reset link is incomplete. <Link className="text-primary underline" href="/forgot-password">Request a new one</Link>.</CardDescription></CardHeader></Card>
    );
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">Choose a new password</CardTitle><CardDescription>At least 10 characters with upper-case, lower-case and a number.</CardDescription></CardHeader>
      <CardContent>
        <AuthForm action={resetPasswordAction} submit="Update password" fields={[
          { name: "token", label: "", hidden: true, value: token },
          { name: "password", label: "New password", type: "password", autoComplete: "new-password" },
          { name: "confirm", label: "Confirm new password", type: "password", autoComplete: "new-password" },
        ]} />
      </CardContent>
    </Card>
  );
}
