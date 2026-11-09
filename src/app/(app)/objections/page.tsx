import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { listObjections } from "@/services/content.service";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { OBJ_CATEGORIES } from "@/lib/labels";
import { ObjectionList } from "./objection-list";

export const metadata = { title: "Objection Center" };

export default async function ObjectionsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const rows = await listObjections(getDb(), user.id, { q: sp.q?.slice(0, 100), category: sp.category, onlyFavorites: sp.fav === "1", popular: sp.popular === "1" });
  return (
    <>
      <PageHeader title="Objection Center" description={`${rows.length} objection${rows.length === 1 ? "" : "s"} with recommended, short, detailed and alternative responses.`} />
      <form method="get" role="search" className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <Input name="q" defaultValue={sp.q} placeholder="Search what the customer says…" aria-label="Search objections" className="lg:col-span-2" />
        <Select name="category" defaultValue={sp.category ?? ""} aria-label="Category"><option value="">All categories</option>{Object.entries(OBJ_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="popular" value="1" defaultChecked={sp.popular === "1"} className="size-4 accent-[var(--primary)]" />Popular</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="fav" value="1" defaultChecked={sp.fav === "1"} className="size-4 accent-[var(--primary)]" />Favourites</label>
        </div>
        <div className="flex gap-2"><Button type="submit">Apply</Button><Button asChild variant="outline"><Link href="/objections">Reset</Link></Button></div>
      </form>
      <ObjectionList items={rows.map((r) => ({ id: r.id, customerSays: r.customerSays, category: r.category, popular: r.popular, approval: r.approval, favorite: r.favorite, why: r.whyItWorks, dont: r.dontSay, responses: r.responses }))} />
    </>
  );
}
