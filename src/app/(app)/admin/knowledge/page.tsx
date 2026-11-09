import Link from "next/link";
import { desc, isNull } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { AdminList } from "@/components/admin/list-table";

export const metadata = { title: "Manage knowledge" };
export default async function AdminKnowledge() {
  await requirePageAdmin("content:read");
  const rows = await getDb().select().from(s.knowledgeArticles).where(isNull(s.knowledgeArticles.deletedAt)).orderBy(desc(s.knowledgeArticles.updatedAt)).limit(300);
  return (<><PageHeader title="Knowledge articles" description={`${rows.length} articles`} actions={<Button asChild><Link href="/admin/knowledge/new">New article</Link></Button>} />
    <AdminList entity="article" editBase="/admin/knowledge" rows={rows.map((r) => ({ id: r.id, title: r.title, status: r.status, approval: r.approval, meta: r.section }))} /></>);
}
