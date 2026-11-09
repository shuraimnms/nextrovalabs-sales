import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getScript } from "@/services/content.service";
import { ApprovalBadge } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { DIFFICULTY, SERVICES, STAGES } from "@/lib/labels";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return { title: (await params).slug.replace(/-/g, " ").slice(0, 60) };
}

export default async function ScriptDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await requireUser();
  const r = await getScript(getDb(), user.id, slug);
  if (!r) notFound();
  const { script: sc } = r;
  return (
    <article className="space-y-6">
      <Link href="/scripts" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />All scripts</Link>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{sc.title}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5"><Badge tone="brand">{r.category}</Badge><Badge>{SERVICES[sc.service]}</Badge>{sc.stage && <Badge>{STAGES[sc.stage]}</Badge>}<Badge>{DIFFICULTY[sc.difficulty]}</Badge><Badge>v{sc.version}</Badge><ApprovalBadge approval={sc.approval} /></div>
          <p className="mt-2 text-xs text-muted-foreground">Last updated {sc.updatedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
        </div>
        <FavoriteButton kind="script" id={sc.id} initial={r.favorite} />
      </header>
      <Card><CardHeader><CardTitle>When to use it</CardTitle></CardHeader><CardContent><p>{sc.scenario}</p></CardContent></Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between"><CardTitle>Recommended wording</CardTitle><CopyButton text={sc.recommended} /></CardHeader>
        <CardContent><p className="script-text text-lg">{sc.recommended}</p></CardContent>
      </Card>
      {sc.alternative && (
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Alternative wording</CardTitle><CopyButton text={sc.alternative} /></CardHeader>
          <CardContent><p className="script-text text-lg">{sc.alternative}</p></CardContent>
        </Card>
      )}
      {sc.englishVersion && (
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>English version</CardTitle><CopyButton text={sc.englishVersion} /></CardHeader>
          <CardContent><p className="script-text text-muted-foreground">{sc.englishVersion}</p></CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Usage guidance</CardTitle></CardHeader><CardContent><p className="script-text text-sm">{sc.usageGuidance}</p></CardContent></Card>
        <Card className="border-danger/40"><CardHeader><CardTitle>Things to avoid</CardTitle></CardHeader><CardContent><p className="script-text text-sm">{sc.thingsToAvoid}</p></CardContent></Card>
      </div>
    </article>
  );
}
