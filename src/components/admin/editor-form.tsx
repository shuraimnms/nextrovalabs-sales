"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export type Field =
  | { name: string; label: string; type: "text" | "number"; hint?: string; max?: number }
  | { name: string; label: string; type: "textarea"; rows?: number; hint?: string; max?: number }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; hint?: string }
  | { name: string; label: string; type: "checkbox"; hint?: string };

type Values = Record<string, string | boolean | number | null | undefined>;
type Result = { ok: true; id?: string } | { ok: false; error: string };

export function EditorForm({ fields, initial, action, backHref, submitLabel = "Save", extra }: {
  fields: Field[]; initial: Record<string, unknown>; action: (v: Values) => Promise<Result>; backHref: string; submitLabel?: string; extra?: React.ReactNode;
}) {
  const router = useRouter();
  const [v, setV] = useState<Values>(() => Object.fromEntries(fields.map((f) => [f.name, (initial[f.name] ?? (f.type === "checkbox" ? false : "")) as Values[string]])));
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  const set = (k: string, val: string | boolean) => { setV((p) => ({ ...p, [k]: val })); setSaved(false); };

  return (
    <form onSubmit={(e) => { e.preventDefault(); setErr(null); start(async () => { const r = await action(v); if (!r.ok) setErr(r.error); else { setSaved(true); router.refresh(); } }); }} className="space-y-4">
      {fields.map((f) => {
        const id = `f-${f.name}`;
        if (f.type === "checkbox") return <label key={f.name} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!v[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="size-4 accent-[var(--primary)]" />{f.label}</label>;
        return (
          <div key={f.name}>
            <Label htmlFor={id}>{f.label}</Label>
            {f.type === "textarea" ? <Textarea id={id} rows={f.rows ?? 4} maxLength={f.max} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className="mt-1" />
              : f.type === "select" ? <Select id={id} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className="mt-1">{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</Select>
              : <Input id={id} type={f.type} maxLength={f.max} value={String(v[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className="mt-1" />}
            {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        );
      })}
      {extra}
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>
        <Button type="button" variant="outline" onClick={() => router.push(backHref)}>Back to list</Button>
        {saved && <span role="status" className="text-sm text-success">Saved.</span>}
      </div>
    </form>
  );
}
