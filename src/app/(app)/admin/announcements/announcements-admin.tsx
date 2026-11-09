"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntityAction, saveAnnouncementAction, setStatusAction } from "@/app/actions-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

type Row = { id: string; title: string; body: string; priority: string; status: string; at: string };
export function AnnouncementsAdmin({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [priority, setPriority] = useState("NORMAL");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) => start(async () => { setErr(null); const r = await fn(); if (!r.ok) setErr((r as { error: string }).error); else router.refresh(); });
  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={(e) => { e.preventDefault(); act(async () => { const r = await saveAnnouncementAction(null, { title, body, priority }); if (r.ok) { setTitle(""); setBody(""); } return r; }); }} className="h-fit space-y-3 rounded-xl border border-border bg-card p-4">
        <h2 className="font-semibold">New announcement</h2>
        <div><Label htmlFor="a-title">Title</Label><Input id="a-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} className="mt-1" required /></div>
        <div><Label htmlFor="a-body">Message</Label><Textarea id="a-body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={3000} className="mt-1" required /></div>
        <div><Label htmlFor="a-pri">Priority</Label><Select id="a-pri" value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1"><option value="LOW">Low</option><option value="NORMAL">Normal</option><option value="HIGH">Important</option><option value="URGENT">Urgent</option></Select></div>
        {err && <p role="alert" className="text-sm text-danger">{err}</p>}
        <Button type="submit" disabled={pending}>Save as draft</Button>
      </form>
      <ul className="space-y-3">
        {rows.length === 0 && <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No announcements yet.</li>}
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{r.title}</h3><Badge tone={r.status === "PUBLISHED" ? "success" : "neutral"}>{r.status === "PUBLISHED" ? "Published" : r.status === "ARCHIVED" ? "Archived" : "Draft"}</Badge><Badge>{r.priority.toLowerCase()}</Badge></div>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{r.body}</p>
            <div className="mt-3 flex gap-2">
              {r.status !== "PUBLISHED" ? <Button size="sm" disabled={pending} onClick={() => act(() => setStatusAction("announcement", r.id, "PUBLISHED"))}>Publish</Button> : <Button size="sm" variant="outline" disabled={pending} onClick={() => act(() => setStatusAction("announcement", r.id, "ARCHIVED"))}>Archive</Button>}
              <Button size="sm" variant="danger" disabled={pending} onClick={() => { if (window.confirm("Delete this announcement permanently?")) act(() => deleteEntityAction("announcement", r.id)); }}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
