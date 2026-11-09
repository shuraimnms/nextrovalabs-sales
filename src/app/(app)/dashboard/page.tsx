import Link from "next/link";
import { ArrowRight, Award, BookOpen, Drama, Headphones, MessageCircle, ScrollText, ShieldQuestion, Star } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { employeeDashboard } from "@/services/content.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dashboard" };

const QUICK = [
  { href: "/live-call", label: "Start a call", icon: Headphones, hint: "Guided script by stage" },
  { href: "/scripts", label: "Script library", icon: ScrollText, hint: "Search 100+ scripts" },
  { href: "/objections", label: "Objection help", icon: ShieldQuestion, hint: "Ready responses" },
  { href: "/templates", label: "WhatsApp", icon: MessageCircle, hint: "Copy a template" },
  { href: "/roleplay", label: "Practise", icon: Drama, hint: "Roleplay simulator" },
  { href: "/academy", label: "Learn", icon: BookOpen, hint: "Courses and quizzes" },
];

export default async function Dashboard() {
  const user = await requireUser();
  const d = await employeeDashboard(getDb(), user.id);
  const first = user.name.split(" ")[0];
  return (
    <>
      <PageHeader title={`Welcome, ${first}`} description="Everything on this page comes from your own activity and the content your admins have published." />

      <section aria-label="Quick actions" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="group rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary">
            <q.icon className="mb-3 size-5 text-primary" aria-hidden />
            <p className="text-sm font-semibold">{q.label}</p>
            <p className="text-xs text-muted-foreground">{q.hint}</p>
          </Link>
        ))}
      </section>

      {d.announcements.length > 0 && (
        <section aria-label="Announcements" className="mt-6 space-y-3">
          {d.announcements.map((a) => (
            <Card key={a.id} className={a.priority === "URGENT" || a.priority === "HIGH" ? "border-warning" : ""}>
              <CardHeader><div className="flex items-center gap-2"><CardTitle>{a.title}</CardTitle>{(a.priority === "URGENT" || a.priority === "HIGH") && <Badge tone="warning">{a.priority === "URGENT" ? "Urgent" : "Important"}</Badge>}</div></CardHeader>
              <CardContent><p className="whitespace-pre-line text-sm">{a.body}</p></CardContent>
            </Card>
          ))}
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Your learning</CardTitle><CardDescription>{d.overallPct}% of all lessons completed · {d.certificates} certificate{d.certificates === 1 ? "" : "s"} earned</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={d.overallPct} label="Overall Academy progress" />
            {d.inProgress ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted p-4">
                <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{d.inProgress.pct > 0 ? "Continue" : "Start here"}</p><p className="truncate font-semibold">Course {d.inProgress.number}: {d.inProgress.title}</p><p className="text-xs text-muted-foreground">{d.inProgress.completed}/{d.inProgress.lessonCount} lessons</p></div>
                <Button asChild><Link href={`/academy/${d.inProgress.slug}`}>{d.inProgress.pct > 0 ? "Resume" : "Begin"} <ArrowRight /></Link></Button>
              </div>
            ) : <p className="text-sm text-muted-foreground">All courses completed. Great work!</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your activity</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-3"><dt className="text-xs text-muted-foreground">Quiz attempts</dt><dd className="text-2xl font-semibold">{d.quizAttempts}</dd></div>
              <div className="rounded-lg bg-muted p-3"><dt className="text-xs text-muted-foreground">Roleplays</dt><dd className="text-2xl font-semibold">{d.roleplayCount}</dd></div>
              <div className="col-span-2 rounded-lg bg-muted p-3"><dt className="flex items-center gap-2 text-xs text-muted-foreground"><Award className="size-4 text-primary" aria-hidden />Certificates</dt><dd className="text-2xl font-semibold">{d.certificates}</dd></div>
            </dl>
            {d.quizAttempts === 0 && d.roleplayCount === 0 && <p className="mt-3 text-xs text-muted-foreground">Nothing yet — your stats will appear as you learn and practise.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Star className="size-4" aria-hidden />Favourite scripts</CardTitle></CardHeader>
          <CardContent>
            {d.favScripts.length === 0 ? <p className="text-sm text-muted-foreground">Star a script in the library to keep it handy here.</p> : (
              <ul className="space-y-2">{d.favScripts.map((f) => <li key={f.slug}><Link className="block rounded-lg p-2 text-sm hover:bg-muted" href={`/scripts/${f.slug}`}><span className="font-medium">{f.title}</span></Link></li>)}</ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recently updated scripts</CardTitle></CardHeader>
          <CardContent><ul className="space-y-2">{d.recent.map((r) => <li key={r.slug}><Link className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm hover:bg-muted" href={`/scripts/${r.slug}`}><span className="truncate font-medium">{r.title}</span><time className="shrink-0 text-xs text-muted-foreground" dateTime={r.updatedAt.toISOString()}>{r.updatedAt.toLocaleDateString("en-IN")}</time></Link></li>)}</ul></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Featured knowledge</CardTitle></CardHeader>
          <CardContent><ul className="space-y-2">{d.featured.map((k) => <li key={k.slug}><Link className="block rounded-lg p-2 text-sm hover:bg-muted" href={`/knowledge/${k.slug}`}><span className="font-medium">{k.title}</span><span className="block text-xs text-muted-foreground">{k.section}</span></Link></li>)}</ul></CardContent>
        </Card>
      </div>
    </>
  );
}
