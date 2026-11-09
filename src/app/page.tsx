import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { homeFor } from "@/lib/permissions";

export default async function Root() {
  const u = await getCurrentUser();
  redirect(u ? homeFor(u.role) : "/login");
}
