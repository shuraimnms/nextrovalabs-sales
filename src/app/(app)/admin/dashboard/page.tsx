import Link from "next/link";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { adminOverview } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, STATUS_TONE } from "@/components/admin/list-table";

export const metadata = { title: "Admin Home" };

export default async function AdminHome() {
  await requirePageAdmin("content:read");
  const o = await adminOverview(getDb());
  const stats = [
    { label: "Active employees", value: o.employees }, { label: "Published scripts", value: o.published }, { label: "Draft scripts", value: o.drafts },
    { label: "Training completion", value: `${o.completionPct}%` }, { label: "Average quiz score", value: o.avgQuiz == null ? "—" : `${o.avgQuiz}%` },
    { label: "Pending admin confirmation", value: o.pendingConfirm },
  ];
  return (
    <>
      <PageHeader title="Admin Home" description="Live figures from your database. “—” means there is no data yet." />
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {stats.map((s) => <div key={s.label} className="rounded-xl border border-border bg-card p-4"><dt className="text-xs text-muted-foreground">{s.label}</dt><dd className="mt-1 text-3xl font-semibold">{s.value}</dd></div>)}
      </dl>
      {o.pendingConfirm > 0 && <p className="mt-4 rounded-lg bg-warning-bg p-3 text-sm text-warning">{o.pendingConfirm} item(s) are marked “pending admin confirmation” (timelines, payment terms, policies). Verify them, then edit each item and set approval to Approved.</p>}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Recently updated scripts</CardTitle></CardHeader><CardContent><ul className="space-y-2">{o.recent.map((r) => <li key={r.slug} className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{r.title}</span><span className="flex shrink-0 items-center gap-2"><Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge><time className="text-xs text-muted-foreground">{r.updatedAt.toLocaleDateString("en-IN")}</time></span></li>)}</ul><Link href="/admin/scripts" className="mt-3 inline-block text-sm text-primary underline">Manage scripts</Link></CardContent></Card>
        <Card><CardHeader><CardTitle>Recent administrative activity</CardTitle></CardHeader><CardContent>{o.activity.length === 0 ? <p className="text-sm text-muted-foreground">No activity recorded yet.</p> : <ul className="space-y-2">{o.activity.map((a) => <li key={a.id} className="text-sm"><span className="font-medium">{a.actor ?? "System"}</span> · <code className="text-xs">{a.action}</code><time className="ml-2 text-xs text-muted-foreground">{a.at.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</time></li>)}</ul>}</CardContent></Card>
      </div>
    </>
  );
}
