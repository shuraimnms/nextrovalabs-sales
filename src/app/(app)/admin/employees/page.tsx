import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { listUsers } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Employees } from "./employees";

export const metadata = { title: "Employees" };
export default async function AdminEmployees() {
  const me = await requirePageAdmin("users:read");
  const rows = await listUsers(getDb(), me);
  return (<><PageHeader title="Employees" description="Create accounts, suspend access and issue password-reset links. New users must change their password at first sign-in." />
    <Employees meId={me.id} meRole={me.role} rows={rows.map((r) => ({ id: r.id, name: r.name, email: r.email, role: r.role, status: r.status, last: r.lastLoginAt?.toISOString() ?? null }))} /></>);
}
