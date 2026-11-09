import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, Circle } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getCourse } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { DIFFICULTY } from "@/lib/labels";

const TYPE: Record<string, string> = { READING: "Reading", EXAMPLE: "Example", ROLEPLAY: "Roleplay exercise", KNOWLEDGE_CHECK: "Knowledge check" };

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const user = await requireUser();
  const d = await getCourse(getDb(), user.id, slug);
  if (!d) notFound();
  const pct = d.total ? Math.round((d.completed / d.total) * 100) : 0;
  const first = d.modules.flatMap((m) => m.lessons).find((l) => !l.done) ?? d.modules[0]?.lessons[0];
  const ready = d.completed >= d.total && d.total > 0;
  const best = d.attempts.reduce((m, a) => Math.max(m, a.scorePct), 0);
  return (
    <div className="space-y-6">
      <Link href="/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />Academy</Link>
      <header>
        <div className="flex flex-wrap gap-2"><Badge tone="brand">Course {d.course.number}</Badge><Badge>{DIFFICULTY[d.course.level]}</Badge></div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{d.course.title}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{d.course.summary}</p>
        <ProgressBar className="mt-4 max-w-md" value={pct} label={`${d.completed} of ${d.total} lessons complete`} />
        <div className="mt-4 flex flex-wrap gap-2">
          {first && <Button asChild><Link href={`/academy/${slug}/lesson/${first.id}`}>{d.completed ? "Continue" : "Start course"}</Link></Button>}
          {d.certificate && <Button asChild variant="outline"><Link href={`/academy/certificate/${d.certificate.code}`}><Award />View certificate</Link></Button>}
        </div>
      </header>

      {d.modules.map((m, mi) => (
        <section key={m.id} aria-labelledby={`m-${m.id}`} className="rounded-xl border border-border bg-card p-5">
          <h2 id={`m-${m.id}`} className="font-semibold">Module {mi + 1}: {m.title}</h2>
          <ol className="mt-3 divide-y divide-border">
            {m.lessons.map((l) => (
              <li key={l.id}><Link href={`/academy/${slug}/lesson/${l.id}`} className="flex items-center gap-3 py-3 hover:text-primary">
                {l.done ? <CheckCircle2 className="size-5 shrink-0 text-success" aria-label="Completed" /> : <Circle className="size-5 shrink-0 text-muted-foreground" aria-label="Not completed" />}
                <span className="min-w-0 flex-1"><span className="block font-medium">{l.title}</span><span className="text-xs text-muted-foreground">{TYPE[l.type]} · {l.minutes} min</span></span>
              </Link></li>
            ))}
          </ol>
        </section>
      ))}

      {d.quiz && (
        <section className="rounded-xl border border-border bg-card p-5" aria-labelledby="quiz-h">
          <h2 id="quiz-h" className="font-semibold">Course assessment</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pass mark: {d.quiz.passingScore}%. {ready ? "You can take the quiz now." : "Finish every lesson to earn the certificate. You may still practise the quiz at any time."}</p>
          {d.attempts.length > 0 && <p className="mt-2 text-sm">Best score: <strong>{best}%</strong> · {d.attempts.length} recent attempt{d.attempts.length === 1 ? "" : "s"}</p>}
          <Button asChild className="mt-3" variant={ready ? "primary" : "outline"}><Link href={`/academy/${slug}/quiz`}>{d.attempts.length ? "Retake quiz" : "Take quiz"}</Link></Button>
        </section>
      )}
    </div>
  );
}
