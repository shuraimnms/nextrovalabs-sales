import Link from "next/link";
import { desc, isNull } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/list-table";
import { TEMPLATE_CATEGORIES } from "@/lib/labels";

export const metadata = { title: "Manage templates" };
export default async function AdminTemplates() {
  await requirePageAdmin("content:read");
  const rows = await getDb().select().from(s.whatsappTemplates).where(isNull(s.whatsappTemplates.deletedAt)).orderBy(desc(s.whatsappTemplates.updatedAt)).limit(300);
  return (<><PageHeader title="WhatsApp templates" description={`${rows.length} templates`} actions={<Button asChild><Link href="/admin/templates/new">New template</Link></Button>} />
    <AdminList entity="template" editBase="/admin/templates" rows={rows.map((r) => ({ id: r.id, title: r.title, status: r.status, approval: r.approval, meta: TEMPLATE_CATEGORIES[r.category] }))} /></>);
}
