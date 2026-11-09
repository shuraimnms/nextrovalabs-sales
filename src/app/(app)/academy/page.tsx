import Link from "next/link";
import { Award, Clock } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { listCourses } from "@/services/content.service";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { DIFFICULTY } from "@/lib/labels";

export const metadata = { title: "Academy" };
const PATHS = [
  { level: "BEGINNER", name: "Beginner path", note: "Know the company, the services and how to speak professionally." },
  { level: "INTERMEDIATE", name: "Intermediate path", note: "Run a first call, discover needs, talk price and handle objections." },
  { level: "ADVANCED", name: "Advanced path", note: "Listen deeply, close with clarity and sell consultatively." },
];

export default async function Academy() {
  const user = await requireUser();
  const courses = await listCourses(getDb(), user.id);
  return (
    <>
      <PageHeader title="Academy" description="Short lessons, roleplay exercises and a quiz per course. Pass the quiz after finishing every lesson to earn a certificate." />
      <div className="space-y-10">
        {PATHS.map((p) => {
          const list = courses.filter((c) => c.level === p.level);
          if (!list.length) return null;
          return (
            <section key={p.level} aria-labelledby={`path-${p.level}`}>
              <h2 id={`path-${p.level}`} className="text-xl font-semibold">{p.name}</h2>
              <p className="mb-4 text-sm text-muted-foreground">{p.note}</p>
              <ul className="grid gap-4 md:grid-cols-2">
                {list.map((c) => (
                  <li key={c.id}>
                    <Link href={`/academy/${c.slug}`} className="block h-full rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:border-primary">
                      <div className="flex flex-wrap items-center gap-2"><Badge tone="brand">Course {c.number}</Badge><Badge>{DIFFICULTY[c.level]}</Badge>{c.certified && <Badge tone="success"><Award className="size-3" aria-hidden />Certified</Badge>}</div>
                      <h3 className="mt-3 text-lg font-semibold">{c.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.summary}</p>
                      <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" aria-hidden />{c.lessonCount} lessons · about {c.minutes} min</p>
                      <ProgressBar className="mt-3" value={c.pct} label={`Course ${c.number} progress`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
