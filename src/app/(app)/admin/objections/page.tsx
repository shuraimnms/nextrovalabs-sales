import Link from "next/link";
import { desc, isNull } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/list-table";
import { OBJ_CATEGORIES } from "@/lib/labels";

export const metadata = { title: "Manage objections" };
export default async function AdminObjections() {
  await requirePageAdmin("content:read");
  const rows = await getDb().select().from(s.objections).where(isNull(s.objections.deletedAt)).orderBy(desc(s.objections.updatedAt)).limit(300);
  return (<><PageHeader title="Objections" description={`${rows.length} objections`} actions={<Button asChild><Link href="/admin/objections/new">New objection</Link></Button>} />
    <AdminList entity="objection" editBase="/admin/objections" rows={rows.map((r) => ({ id: r.id, title: r.customerSays, status: r.status, approval: r.approval, meta: OBJ_CATEGORIES[r.category] }))} /></>);
}
