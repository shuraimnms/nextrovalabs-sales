"use client";
import { ShieldQuestion } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CopyButton } from "@/components/shared/copy-button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { ApprovalBadge } from "@/components/shared/page-header";
import { OBJ_CATEGORIES, VARIANTS } from "@/lib/labels";
import { cn } from "@/lib/utils/cn";

type Item = { id: string; customerSays: string; category: string; popular: boolean; approval: string; favorite: boolean; why: string; dont: string; responses: Record<string, string> };

function Row({ o }: { o: Item }) {
  const [open, setOpen] = useState(false);
  const [v, setV] = useState("RECOMMENDED");
  const panelId = `obj-${o.id}`;
  return (
    <li className="rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-2 p-4">
        <button className="min-w-0 flex-1 text-left" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((x) => !x)}>
          <span className="block font-semibold">“{o.customerSays}”</span>
          <span className="mt-2 flex flex-wrap gap-1.5"><Badge tone="brand">{OBJ_CATEGORIES[o.category]}</Badge>{o.popular && <Badge tone="success">Popular</Badge>}<ApprovalBadge approval={o.approval} /></span>
        </button>
        <FavoriteButton kind="objection" id={o.id} initial={o.favorite} />
      </div>
      {open && (
        <div id={panelId} className="space-y-4 border-t border-border p-4">
          <div role="tablist" aria-label="Response type" className="flex flex-wrap gap-1">
            {Object.entries(VARIANTS).map(([k, label]) => <button key={k} role="tab" aria-selected={v === k} onClick={() => setV(k)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium", v === k ? "bg-primary text-primary-foreground" : "bg-muted")}>{label}</button>)}
          </div>
          <p className="script-text rounded-lg bg-muted p-4 text-lg">{o.responses[v]}</p>
          <CopyButton text={o.responses[v]} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-success-bg p-3 text-sm text-success"><p className="font-semibold">Why it works</p><p className="mt-1">{o.why}</p></div>
            <div className="rounded-lg bg-danger-bg p-3 text-sm text-danger"><p className="font-semibold">What not to say</p><p className="mt-1">{o.dont}</p></div>
          </div>
        </div>
      )}
    </li>
  );
}

export function ObjectionList({ items }: { items: Item[] }) {
  if (!items.length) return <EmptyState icon={ShieldQuestion} title="No objections match" description="Try a different word or clear the filters." />;
  return <ul className="space-y-3">{items.map((o) => <Row key={o.id} o={o} />)}</ul>;
}
