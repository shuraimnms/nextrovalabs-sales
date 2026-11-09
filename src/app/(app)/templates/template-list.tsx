"use client";
import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/shared/copy-button";
import { ApprovalBadge } from "@/components/shared/page-header";
import { TEMPLATE_CATEGORIES } from "@/lib/labels";
import { cn } from "@/lib/utils/cn";

type Item = { id: string; title: string; category: string; en: string; hi: string; approval: string };
const PH = /\{\{(\w+)\}\}/g;
const pretty = (k: string) => k.replace(/_/g, " ");

function Card({ t }: { t: Item }) {
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [vals, setVals] = useState<Record<string, string>>({});
  const body = lang === "hi" ? t.hi : t.en;
  const keys = useMemo(() => Array.from(new Set([...t.en.matchAll(PH), ...t.hi.matchAll(PH)].map((m) => m[1]))), [t]);
  const filled = body.replace(PH, (m, k) => (vals[k]?.trim() ? vals[k].trim() : m));
  const missing = keys.some((k) => body.includes(`{{${k}}}`) && !vals[k]?.trim());
  return (
    <li className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{t.title}</h2><Badge tone="brand">{TEMPLATE_CATEGORIES[t.category]}</Badge><ApprovalBadge approval={t.approval} /></div>
      <div role="tablist" aria-label="Language" className="flex gap-1">
        {(["hi", "en"] as const).map((l) => <button key={l} role="tab" aria-selected={lang === l} onClick={() => setLang(l)} className={cn("rounded-md px-3 py-1 text-sm font-medium", lang === l ? "bg-primary text-primary-foreground" : "bg-muted")}>{l === "hi" ? "Hinglish" : "English"}</button>)}
      </div>
      {keys.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-3">
          {keys.map((k) => <label key={k} className="text-xs font-medium capitalize text-muted-foreground">{pretty(k)}<Input value={vals[k] ?? ""} onChange={(e) => setVals((p) => ({ ...p, [k]: e.target.value }))} placeholder={`{{${k}}}`} maxLength={120} className="mt-1" /></label>)}
        </div>
      )}
      <p className="script-text rounded-lg bg-muted p-3 text-sm">{filled}</p>
      <div className="flex items-center gap-3"><CopyButton text={filled} />{missing && <span className="text-xs text-warning">Some placeholders are still empty.</span>}</div>
    </li>
  );
}

export function TemplateList({ items }: { items: Item[] }) {
  if (!items.length) return <EmptyState icon={MessageCircle} title="No templates found" description="Try a different search or category." />;
  return <ul className="grid gap-4 lg:grid-cols-2">{items.map((t) => <Card key={t.id} t={t} />)}</ul>;
}
