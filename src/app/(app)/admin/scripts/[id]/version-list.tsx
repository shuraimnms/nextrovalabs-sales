"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { restoreScriptVersionAction } from "@/app/actions-admin";
import { Button } from "@/components/ui/button";

export function VersionList({ scriptId, versions }: { scriptId: string; versions: { id: string; version: number; note: string | null; by: string | null; at: string }[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  return (
    <aside aria-label="Version history" className="h-fit rounded-xl border border-border bg-card p-4">
      <h2 className="font-semibold">Version history</h2>
      <ul className="mt-3 space-y-3">
        {versions.map((v, i) => (
          <li key={v.id} className="text-sm">
            <p className="font-medium">v{v.version}{i === 0 && " (current)"}</p>
            <p className="text-xs text-muted-foreground">{v.note ?? "—"} · {v.by ?? "System"} · {new Date(v.at).toLocaleDateString("en-IN")}</p>
            {i > 0 && <Button size="sm" variant="outline" className="mt-1" disabled={pending} onClick={() => { if (!window.confirm(`Restore version ${v.version}? This creates a new version.`)) return; start(async () => { setErr(null); const r = await restoreScriptVersionAction(scriptId, v.id); if (!r.ok) setErr(r.error); else router.refresh(); }); }}>Restore</Button>}
          </li>
        ))}
      </ul>
      {err && <p role="alert" className="mt-2 text-xs text-danger">{err}</p>}
    </aside>
  );
}
