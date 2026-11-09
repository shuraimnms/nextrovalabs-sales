import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { listTemplates } from "@/services/content.service";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { TEMPLATE_CATEGORIES } from "@/lib/labels";
import { TemplateList } from "./template-list";

export const metadata = { title: "WhatsApp Templates" };

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  await requireUser();
  const rows = await listTemplates(getDb(), { q: sp.q?.slice(0, 100), category: sp.category });
  return (
    <>
      <PageHeader title="WhatsApp Templates" description="Fill the placeholders, copy, and send from your own WhatsApp. This platform never sends messages and never stores phone numbers." />
      <form method="get" role="search" className="mb-6 flex flex-wrap gap-3">
        <Input name="q" defaultValue={sp.q} placeholder="Search templates…" aria-label="Search templates" className="max-w-sm" />
        <Select name="category" defaultValue={sp.category ?? ""} aria-label="Category" className="max-w-xs"><option value="">All categories</option>{Object.entries(TEMPLATE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <Button type="submit">Search</Button><Button asChild variant="outline"><Link href="/templates">Reset</Link></Button>
      </form>
      <TemplateList items={rows.map((r) => ({ id: r.id, title: r.title, category: r.category, en: r.bodyEnglish, hi: r.bodyHinglish, approval: r.approval }))} />
    </>
  );
}
