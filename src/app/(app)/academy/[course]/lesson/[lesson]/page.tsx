import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getCourse } from "@/services/content.service";
import { RichText } from "@/components/shared/rich-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { CompleteLesson } from "./complete-lesson";

const TYPE: Record<string, string> = { READING: "Reading", EXAMPLE: "Practical example", ROLEPLAY: "Roleplay exercise", KNOWLEDGE_CHECK: "Knowledge check" };

export default async function LessonPage({ params }: { params: Promise<{ course: string; lesson: string }> }) {
  const { course: slug, lesson: lessonId } = await params;
  const user = await requireUser();
  const d = await getCourse(getDb(), user.id, slug);
  if (!d) notFound();
  const flat = d.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m.title })));
  const i = flat.findIndex((l) => l.id === lessonId);
  if (i < 0) notFound();
  const l = flat[i], prev = flat[i - 1], nxt = flat[i + 1];
  const pct = Math.round((d.completed / d.total) * 100);
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href={`/academy/${slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />{d.course.title}</Link>
      <ProgressBar value={pct} label={`Course progress`} />
      <header>
        <div className="flex flex-wrap gap-2"><Badge tone="brand">{TYPE[l.type]}</Badge><Badge>{l.minutes} min</Badge><Badge>Lesson {i + 1} of {flat.length}</Badge></div>
        <p className="mt-3 text-sm text-muted-foreground">{l.module}</p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{l.title}</h1>
      </header>
      <div className="rounded-xl border border-border bg-card p-5 text-base sm:p-8"><RichText text={l.body} /></div>
      <CompleteLesson lessonId={l.id} courseSlug={slug} done={l.done} nextHref={nxt ? `/academy/${slug}/lesson/${nxt.id}` : `/academy/${slug}`} nextLabel={nxt ? "Next lesson" : "Back to course"} />
      <nav aria-label="Lesson navigation" className="flex justify-between gap-3">
        {prev ? <Button asChild variant="outline"><Link href={`/academy/${slug}/lesson/${prev.id}`}><ArrowLeft />Previous</Link></Button> : <span />}
        {nxt ? <Button asChild variant="outline"><Link href={`/academy/${slug}/lesson/${nxt.id}`}>Next<ArrowRight /></Link></Button> : <span />}
      </nav>
    </article>
  );
}
