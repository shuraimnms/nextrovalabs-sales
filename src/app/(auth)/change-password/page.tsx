import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/shared/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePasswordAction } from "@/app/actions-auth";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Change password" };

export default async function ChangePasswordPage() {
  const u = await getCurrentUser();
  if (!u) redirect("/login");
  return (
    <Card>
      <CardHeader><CardTitle className="text-xl">{u.mustChangePassword ? "Set your own password" : "Change password"}</CardTitle>
        <CardDescription>{u.mustChangePassword ? "Your manager gave you a temporary password. Choose a private one to continue." : "Other devices will be signed out."}</CardDescription></CardHeader>
      <CardContent>
        <AuthForm action={changePasswordAction} submit="Save password" fields={[
          { name: "current", label: "Current password", type: "password", autoComplete: "current-password" },
          { name: "password", label: "New password", type: "password", autoComplete: "new-password" },
          { name: "confirm", label: "Confirm new password", type: "password", autoComplete: "new-password" },
        ]} />
      </CardContent>
    </Card>
  );
}
