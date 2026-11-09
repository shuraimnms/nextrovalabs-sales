import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { analytics } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseChart } from "./course-chart";

export const metadata = { title: "Analytics" };
export default async function Analytics() {
  await requirePageAdmin("analytics:read");
  const a = await analytics(getDb());
  const dash = (v: number | null, suffix = "") => (v == null ? "—" : `${v}${suffix}`);
  const tiles = [
    { l: "Active employees", v: String(a.activeEmployees) }, { l: "Signed in (30 days)", v: String(a.activeLast30) }, { l: "Lesson completion", v: `${a.completionPct}%` },
    { l: "Quiz attempts", v: String(a.quizAttempts) }, { l: "Average quiz score", v: dash(a.avgQuiz, "%") }, { l: "Quiz pass rate", v: dash(a.quizPassRate, "%") },
    { l: "Certificates issued", v: String(a.certificates) }, { l: "Roleplay sessions", v: String(a.roleplays) }, { l: "Average roleplay score", v: dash(a.roleplayAvg, "/100") },
  ];
  return (
    <>
      <PageHeader title="Analytics" description="Computed from real activity. Empty values mean nothing has happened yet." />
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">{tiles.map((t) => <div key={t.l} className="rounded-xl border border-border bg-card p-4"><dt className="text-xs text-muted-foreground">{t.l}</dt><dd className="mt-1 text-3xl font-semibold">{t.v}</dd></div>)}</dl>
      <Card className="mt-6"><CardHeader><CardTitle>Average quiz score by course</CardTitle></CardHeader><CardContent>
        {a.perCourse.some((c) => c.avg != null) ? <CourseChart data={a.perCourse.filter((c) => c.avg != null).map((c) => ({ name: `C${c.number}`, title: c.title, avg: c.avg as number }))} /> : <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>}
      </CardContent></Card>
      <div tabIndex={0} role="region" aria-label="Per-course results" className="mt-6 overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full text-sm"><caption className="sr-only">Per-course results</caption>
        <thead className="border-b border-border text-left text-xs text-muted-foreground"><tr><th scope="col" className="p-3">Course</th><th scope="col" className="p-3">Attempts</th><th scope="col" className="p-3">Avg score</th><th scope="col" className="p-3">Certificates</th></tr></thead>
        <tbody className="divide-y divide-border">{a.perCourse.map((c) => <tr key={c.number}><td className="p-3">{c.number}. {c.title}</td><td className="p-3">{c.attempts}</td><td className="p-3">{dash(c.avg, "%")}</td><td className="p-3">{c.certs}</td></tr>)}</tbody></table></div>
      <Card className="mt-6"><CardHeader><CardTitle>Most-favourited scripts</CardTitle></CardHeader><CardContent>{a.topFavorites.length ? <ol className="list-decimal space-y-1 pl-5 text-sm">{a.topFavorites.map((f) => <li key={f.title}>{f.title} <span className="text-muted-foreground">({f.n})</span></li>)}</ol> : <p className="text-sm text-muted-foreground">No favourites yet.</p>}</CardContent></Card>
    </>
  );
}
