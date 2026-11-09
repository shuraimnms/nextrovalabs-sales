"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEntityAction, setStatusAction } from "@/app/actions-admin";
import { Button } from "@/components/ui/button";

export function StatusControls({ entity, id, status, canDelete = true, canPublish = true }: { entity: string; id: string; status: string; canDelete?: boolean; canPublish?: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const go = (fn: () => Promise<{ ok: boolean; error?: string }>) => start(async () => { setErr(null); const r = await fn(); if (!r.ok) setErr((r as { error: string }).error); else router.refresh(); });
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {canPublish && status !== "PUBLISHED" && <Button size="sm" disabled={pending} onClick={() => go(() => setStatusAction(entity, id, "PUBLISHED"))}>Publish</Button>}
      {canPublish && status === "PUBLISHED" && <Button size="sm" variant="outline" disabled={pending} onClick={() => go(() => setStatusAction(entity, id, "DRAFT"))}>Unpublish</Button>}
      {status !== "PENDING_REVIEW" && status !== "PUBLISHED" && <Button size="sm" variant="secondary" disabled={pending} onClick={() => go(() => setStatusAction(entity, id, "PENDING_REVIEW"))}>Send for review</Button>}
      {canDelete && <Button size="sm" variant="danger" disabled={pending} onClick={() => { if (window.confirm("Delete this item? It will be archived and hidden from employees.")) go(() => deleteEntityAction(entity, id)); }}>Delete</Button>}
      {err && <span role="alert" className="text-xs text-danger">{err}</span>}
    </div>
  );
}
