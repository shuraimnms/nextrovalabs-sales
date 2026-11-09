import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDb } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";
import { getArticle } from "@/services/content.service";
import { RichText } from "@/components/shared/rich-text";
import { Badge } from "@/components/ui/badge";

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await requireUser();
  const a = await getArticle(getDb(), slug);
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link href="/knowledge" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />Knowledge Base</Link>
      <Badge tone="brand">{a.section}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight">{a.title}</h1>
      <RichText text={a.body} />
      <p className="text-xs text-muted-foreground">Last updated {a.updatedAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
    </article>
  );
}
