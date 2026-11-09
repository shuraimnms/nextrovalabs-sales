import Link from "next/link";
import { ScrollText } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { listScripts } from "@/services/content.service";
import { PageHeader, ApprovalBadge } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Select } from "@/components/ui/input";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { DIFFICULTY, SERVICES, STAGES } from "@/lib/labels";

export const metadata = { title: "Script Library" };
const PAGE = 24;

export default async function ScriptsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const user = await requireUser();
  const db = getDb();
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ rows, total }, cats] = await Promise.all([
    listScripts(db, user.id, { q: sp.q?.slice(0, 100), service: sp.service, stage: sp.stage, category: sp.category, difficulty: sp.difficulty, onlyFavorites: sp.fav === "1", limit: PAGE, offset: (page - 1) * PAGE }),
    db.select().from(s.scriptCategories).orderBy(s.scriptCategories.sortOrder),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (p: number) => { const u = new URLSearchParams(Object.entries(sp).filter(([k, v]) => v && k !== "page") as [string, string][]); u.set("page", String(p)); return `/scripts?${u}`; };

  return (
    <>
      <PageHeader title="Script Library" description={`${total} script${total === 1 ? "" : "s"} in Hinglish with recommended and alternative wording.`} />
      <form method="get" className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-6" role="search" aria-label="Filter scripts">
        <Input name="q" defaultValue={sp.q} placeholder="Search scripts…" aria-label="Search scripts" className="lg:col-span-2" />
        <Select name="category" defaultValue={sp.category ?? ""} aria-label="Category"><option value="">All categories</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</Select>
        <Select name="service" defaultValue={sp.service ?? ""} aria-label="Service"><option value="">All services</option>{Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <Select name="stage" defaultValue={sp.stage ?? ""} aria-label="Call stage"><option value="">All stages</option>{Object.entries(STAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <Select name="difficulty" defaultValue={sp.difficulty ?? ""} aria-label="Difficulty"><option value="">Any level</option>{Object.entries(DIFFICULTY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="fav" value="1" defaultChecked={sp.fav === "1"} className="size-4 accent-[var(--primary)]" /> Favourites only</label>
        <div className="flex gap-2 sm:col-span-1 lg:col-span-5 lg:justify-end"><Button type="submit">Apply filters</Button><Button asChild variant="outline"><Link href="/scripts">Reset</Link></Button></div>
      </form>

      {rows.length === 0 ? <EmptyState icon={ScrollText} title="No scripts match" description="Try removing a filter or searching for a different word." action={<Button asChild variant="outline"><Link href="/scripts">Clear filters</Link></Button>} /> : (
        <ul className="grid gap-3 md:grid-cols-2">
          {rows.map((r) => (
            <li key={r.id} className="flex gap-2 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="min-w-0 flex-1">
                <Link href={`/scripts/${r.slug}`} className="font-semibold hover:text-primary">{r.title}</Link>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.scenario}</p>
                <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone="brand">{r.category}</Badge><Badge>{SERVICES[r.service]}</Badge>{r.stage && <Badge>{STAGES[r.stage]}</Badge>}<Badge>{DIFFICULTY[r.difficulty]}</Badge><ApprovalBadge approval={r.approval} /></div>
              </div>
              <FavoriteButton kind="script" id={r.id} initial={r.favorite} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3 text-sm">
          {page > 1 ? <Button asChild variant="outline" size="sm"><Link href={qs(page - 1)}>Previous</Link></Button> : <span />}
          <span aria-current="page">Page {page} of {pages}</span>
          {page < pages ? <Button asChild variant="outline" size="sm"><Link href={qs(page + 1)}>Next</Link></Button> : <span />}
        </nav>
      )}
    </>
  );
}
