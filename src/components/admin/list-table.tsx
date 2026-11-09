import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusControls } from "./status-controls";

export const STATUS_TONE: Record<string, "success" | "warning" | "neutral" | "brand"> = { PUBLISHED: "success", PENDING_REVIEW: "warning", DRAFT: "neutral", ARCHIVED: "neutral" };
export const STATUS_LABEL: Record<string, string> = { PUBLISHED: "Published", PENDING_REVIEW: "In review", DRAFT: "Draft", ARCHIVED: "Archived" };

export type Row = { id: string; title: string; meta?: string; status: string; approval?: string };
export function AdminList({ entity, rows, editBase, canPublish = true }: { entity: string; rows: Row[]; editBase: string; canPublish?: boolean }) {
  if (!rows.length) return <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>;
  return (
    <ul className="divide-y divide-border rounded-xl border border-border bg-card">
      {rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <Link href={`${editBase}/${r.id}`} className="font-medium hover:text-primary">{r.title}</Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"><Badge tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Badge>{r.approval === "PENDING_ADMIN_CONFIRMATION" && <Badge tone="warning">Pending confirmation</Badge>}{r.meta && <span>{r.meta}</span>}</div>
          </div>
          <StatusControls entity={entity} id={r.id} status={r.status} canPublish={canPublish} />
        </li>
      ))}
    </ul>
  );
}
