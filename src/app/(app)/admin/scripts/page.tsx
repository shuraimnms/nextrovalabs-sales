import Link from "next/link";
import { and, desc, eq, ilike, isNull, type SQL } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { AdminList } from "@/components/admin/list-table";
import { SERVICES } from "@/lib/labels";

export const metadata = { title: "Manage scripts" };

export default async function AdminScripts({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requirePageAdmin("content:read");
  const sp = await searchParams;
  const conds: (SQL | undefined)[] = [isNull(s.scripts.deletedAt)];
  if (sp.status) conds.push(eq(s.scripts.status, sp.status as typeof s.scripts.$inferSelect["status"]));
  if (sp.q) conds.push(ilike(s.scripts.title, `%${sp.q.slice(0, 80)}%`));
  const rows = await getDb().select().from(s.scripts).where(and(...conds)).orderBy(desc(s.scripts.updatedAt)).limit(200);
  return (
    <>
      <PageHeader title="Scripts" description={`${rows.length} shown`} actions={<Button asChild><Link href="/admin/scripts/new">New script</Link></Button>} />
      <form method="get" className="mb-4 flex flex-wrap gap-3"><Input name="q" defaultValue={sp.q} placeholder="Search by title…" aria-label="Search" className="max-w-xs" />
        <Select name="status" defaultValue={sp.status ?? ""} aria-label="Status" className="max-w-[180px]"><option value="">All statuses</option><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="PENDING_REVIEW">In review</option><option value="ARCHIVED">Archived</option></Select><Button type="submit" variant="outline">Filter</Button></form>
      <AdminList entity="script" editBase="/admin/scripts" rows={rows.map((r) => ({ id: r.id, title: r.title, status: r.status, approval: r.approval, meta: `${SERVICES[r.service]} · v${r.version}` }))} />
    </>
  );
}
