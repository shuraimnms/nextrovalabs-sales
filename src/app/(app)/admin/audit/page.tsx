import Link from "next/link";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { auditPage } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Audit logs" };
const SIZE = 30;
export default async function AuditPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requirePageAdmin("audit:read");
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const { rows, total } = await auditPage(getDb(), page, SIZE);
  const pages = Math.max(1, Math.ceil(total / SIZE));
  return (
    <>
      <PageHeader title="Audit logs" description="Who changed what, and when. Secrets are never recorded. Visible to Super Admins only." />
      <div tabIndex={0} role="region" aria-label="Audit log" className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full text-sm"><caption className="sr-only">Audit log entries</caption>
        <thead className="border-b border-border text-left text-xs text-muted-foreground"><tr><th scope="col" className="p-3">When</th><th scope="col" className="p-3">Who</th><th scope="col" className="p-3">Action</th><th scope="col" className="p-3">Target</th><th scope="col" className="p-3">Details</th></tr></thead>
        <tbody className="divide-y divide-border">{rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No entries.</td></tr>}
          {rows.map((r) => <tr key={r.id}><td className="whitespace-nowrap p-3 text-xs">{r.at.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td><td className="p-3">{r.actor ?? "System"}<span className="block text-xs text-muted-foreground">{r.actorEmail}</span></td><td className="p-3"><code className="text-xs">{r.action}</code></td><td className="p-3 text-xs">{r.resource}{r.resourceId ? ` · ${r.resourceId.slice(0, 8)}` : ""}</td><td className="max-w-xs truncate p-3 font-mono text-xs text-muted-foreground" title={r.metadata ? JSON.stringify(r.metadata) : ""}>{r.metadata ? JSON.stringify(r.metadata) : "—"}</td></tr>)}</tbody></table></div>
      <nav aria-label="Pagination" className="mt-4 flex items-center justify-center gap-3 text-sm">
        {page > 1 ? <Button asChild size="sm" variant="outline"><Link href={`/admin/audit?page=${page - 1}`}>Previous</Link></Button> : <span />}<span aria-current="page">Page {page} of {pages}</span>
        {page < pages ? <Button asChild size="sm" variant="outline"><Link href={`/admin/audit?page=${page + 1}`}>Next</Link></Button> : <span />}</nav>
    </>
  );
}
