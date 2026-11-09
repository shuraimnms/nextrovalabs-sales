import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/shared/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "@/app/actions-auth";
import { getCurrentUser } from "@/lib/auth/session";
import { homeFor } from "@/lib/permissions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const u = await getCurrentUser();
  if (u) redirect(homeFor(u.role));
  const sp = await searchParams;
  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">Welcome back</CardTitle><CardDescription>Sign in with the account your manager created for you.</CardDescription></CardHeader>
      <CardContent>
        {sp.reset && <p role="status" className="mb-4 rounded-lg bg-success-bg p-3 text-sm text-success">Password updated. Please sign in.</p>}
        <AuthForm
          action={loginAction}
          submit="Sign in"
          fields={[{ name: "email", label: "Work email", type: "email", autoComplete: "username" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]}
          hint={<p className="text-center text-sm"><Link className="text-primary underline-offset-4 hover:underline" href="/forgot-password">Forgot password?</Link></p>}
        />
      </CardContent>
    </Card>
  );
}
