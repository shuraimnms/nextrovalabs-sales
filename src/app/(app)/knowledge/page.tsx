import Link from "next/link";
import { Library } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { listArticles } from "@/services/content.service";
import { PageHeader, ApprovalBadge } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/content/knowledge";

export const metadata = { title: "Knowledge Base" };

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  await requireUser();
  const rows = await listArticles(getDb(), { q: sp.q?.slice(0, 100), section: sp.section });
  const bySection = SECTIONS.map((s) => ({ s, items: rows.filter((r) => r.section === s) })).filter((g) => g.items.length);
  return (
    <>
      <PageHeader title="Knowledge Base" description="Verified company information. Items marked pending need admin confirmation before you quote them." />
      <form method="get" role="search" className="mb-6 flex flex-wrap gap-3">
        <Input name="q" defaultValue={sp.q} placeholder="Search knowledge…" aria-label="Search knowledge" className="max-w-sm" />
        <Select name="section" defaultValue={sp.section ?? ""} aria-label="Section" className="max-w-xs"><option value="">All sections</option>{SECTIONS.map((s) => <option key={s}>{s}</option>)}</Select>
        <Button type="submit">Search</Button>
      </form>
      {bySection.length === 0 ? <EmptyState icon={Library} title="No articles found" description="Try a different word or clear the section filter." /> : (
        <div className="space-y-8">
          {bySection.map((g) => (
            <section key={g.s} aria-labelledby={`sec-${g.s}`}>
              <h2 id={`sec-${g.s}`} className="mb-3 text-lg font-semibold">{g.s}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {g.items.map((a) => <li key={a.id}><Link href={`/knowledge/${a.slug}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary"><span className="font-medium">{a.title}</span><span className="mt-1 block"><ApprovalBadge approval={a.approval} /></span></Link></li>)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
