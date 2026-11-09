import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/shared/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordAction } from "@/app/actions-auth";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">Reset your password</CardTitle><CardDescription>Enter your work email. Reset links expire after 30 minutes and work once.</CardDescription></CardHeader>
      <CardContent>
        <AuthForm action={forgotPasswordAction} submit="Send reset link" fields={[{ name: "email", label: "Work email", type: "email", autoComplete: "username" }]}
          hint={<p className="text-center text-sm"><Link className="text-primary underline-offset-4 hover:underline" href="/login">Back to sign in</Link></p>} />
      </CardContent>
    </Card>
  );
}
