"use client";
import { ChevronLeft, ChevronRight, Expand, Minimize2, Minus, Plus, Repeat, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { loadCallScriptsAction } from "@/app/actions-content";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { CopyButton } from "@/components/shared/copy-button";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { ApprovalBadge } from "@/components/shared/page-header";
import { SERVICES, STAGES, STAGE_ORDER, OBJ_CATEGORIES } from "@/lib/labels";
import { STAGE_GUIDANCE } from "@/lib/stage-guidance";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

type CallScript = { id: string; slug: string; title: string; scenario: string; recommended: string; alternative: string | null; usage: string; avoid: string; approval: string; favorite: boolean };
type Obj = { id: string; customerSays: string; category: string; favorite: boolean; approval: string; dontSay: string; responses: Record<"RECOMMENDED" | "SHORT" | "DETAILED" | "ALTERNATIVE", string> };

export function LiveCall({ initialTextSize, objections }: { initialTextSize: number; objections: Obj[] }) {
  const [service, setService] = useState("WEBSITE");
  const [stage, setStage] = useState("OPENING");
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [idx, setIdx] = useState(0);
  const [alt, setAlt] = useState(false);
  const [size, setSize] = useState(initialTextSize);
  const [focus, setFocus] = useState(false);
  const [loading, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [objId, setObjId] = useState("");
  const [objQ, setObjQ] = useState("");
  const [variant, setVariant] = useState<"RECOMMENDED" | "SHORT" | "DETAILED" | "ALTERNATIVE">("RECOMMENDED");
  const seq = useRef(0);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const id = ++seq.current;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset error before loading scripts for the new selection
    setError(null);
    start(async () => {
      try {
        const r = await loadCallScriptsAction(service, stage);
        if (id !== seq.current) return;
        setScripts(r.scripts); setIdx(0); setAlt(false);
        if (!r.ok) setError("Could not load scripts for this selection.");
      } catch { if (id === seq.current) setError("Could not load scripts. Check your connection and try again."); }
    });
  }, [service, stage, retry]);

  const stageIdx = STAGE_ORDER.indexOf(stage);
  const cur = scripts[idx];
  const text = cur ? (alt && cur.alternative ? cur.alternative : cur.recommended) : "";
  const filteredObj = useMemo(() => {
    const q = objQ.trim().toLowerCase();
    return q ? objections.filter((o) => o.customerSays.toLowerCase().includes(q)) : objections;
  }, [objections, objQ]);
  const selectedObj = objections.find((o) => o.id === objId);

  const next = useCallback(() => {
    setAlt(false);
    if (idx < scripts.length - 1) setIdx(idx + 1);
    else if (stageIdx < STAGE_ORDER.length - 1) setStage(STAGE_ORDER[stageIdx + 1]);
  }, [idx, scripts.length, stageIdx]);
  const prev = useCallback(() => {
    setAlt(false);
    if (idx > 0) setIdx(idx - 1);
    else if (stageIdx > 0) setStage(STAGE_ORDER[stageIdx - 1]);
  }, [idx, stageIdx]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key.toLowerCase() === "a" && cur?.alternative) setAlt((v) => !v);
      else if (e.key.toLowerCase() === "f") setFocus((v) => !v);
      else if (e.key === "Escape") setFocus(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [next, prev, cur]);

  const g = STAGE_GUIDANCE[stage];
  const overall = Math.round(((stageIdx + (scripts.length ? (idx + 1) / scripts.length : 0)) / STAGE_ORDER.length) * 100);

  const scriptPanel = (
    <section aria-label="Current script" className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-8">
      {loading && !cur ? <p role="status" className="text-muted-foreground">Loading scripts…</p> : error ? (
        <div role="alert" className="space-y-3"><p className="text-danger">{error}</p><Button variant="outline" onClick={() => setRetry((n) => n + 1)}>Try again</Button></div>
      ) : !cur ? (
        <p className="text-muted-foreground">No script is published for <strong>{SERVICES[service]}</strong> at <strong>{STAGES[stage]}</strong> yet. Try the next stage or choose “General”.</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge tone="brand">{STAGES[stage]}</Badge><Badge>{idx + 1} of {scripts.length}</Badge>{alt && <Badge tone="warning">Alternative wording</Badge>}<ApprovalBadge approval={cur.approval} />
          </div>
          <h2 className="text-sm font-medium text-muted-foreground">{cur.title}</h2>
          <p className="script-text mt-3 font-medium" style={{ fontSize: `${size}px` }} aria-live="polite">{text}</p>
          <p className="mt-5 text-sm text-muted-foreground"><strong>When:</strong> {cur.scenario}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={prev} aria-label="Previous script"><ChevronLeft />Prev</Button>
            <Button onClick={next} aria-label="Next script">Next<ChevronRight /></Button>
            <CopyButton text={text} size="md" />
            {cur.alternative && <Button variant="secondary" onClick={() => setAlt((v) => !v)} aria-pressed={alt}><Repeat />{alt ? "Show recommended" : "Show alternative"}</Button>}
            <FavoriteButton key={cur.id} kind="script" id={cur.id} initial={cur.favorite} />
          </div>
          <details className="mt-5 rounded-lg bg-muted p-3 text-sm"><summary className="cursor-pointer font-medium">Usage guidance and things to avoid</summary>
            <p className="script-text mt-2"><strong>Use:</strong> {cur.usage}</p><p className="script-text mt-2 text-danger"><strong>Avoid:</strong> {cur.avoid}</p>
            <Link className="mt-2 inline-block text-primary underline" href={`/scripts/${cur.slug}`}>Open full script</Link>
          </details>
        </>
      )}
    </section>
  );

  return (
    <div className={cn(focus && "fixed inset-0 z-50 overflow-y-auto bg-background p-4 sm:p-8")}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Live Call Companion</h1>
          {!focus && <p className="text-sm text-muted-foreground">A guide only. Nothing you do here records the call or stores any customer details.</p>}</div>
        <div className="flex items-center gap-1" role="group" aria-label="Display controls">
          <Button variant="outline" size="icon" onClick={() => setSize((v) => Math.max(14, v - 2))} aria-label="Decrease text size"><Minus /></Button>
          <span className="w-12 text-center text-sm tabular-nums" aria-live="polite">{size}px</span>
          <Button variant="outline" size="icon" onClick={() => setSize((v) => Math.min(40, v + 2))} aria-label="Increase text size"><Plus /></Button>
          <Button variant="outline" onClick={() => setFocus((v) => !v)} aria-pressed={focus}>{focus ? <Minimize2 /> : <Expand />}{focus ? "Exit focus" : "Focus mode"}</Button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">Service type<Select value={service} onChange={(e) => setService(e.target.value)} className="mt-1">{Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</Select></label>
        <label className="text-sm font-medium">Call stage<Select value={stage} onChange={(e) => setStage(e.target.value)} className="mt-1">{STAGE_ORDER.map((k, i) => <option key={k} value={k}>{i + 1}. {STAGES[k]}</option>)}</Select></label>
      </div>
      <ProgressBar value={overall} label={`Call progress: stage ${stageIdx + 1} of ${STAGE_ORDER.length}`} className="mb-5" />

      <div className={cn("grid gap-5", !focus && "lg:grid-cols-[1fr_340px]")}>
        <div className="space-y-5">
          {scriptPanel}
          <section aria-label="Customer says" className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-lg font-semibold">Customer says…</h2>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" aria-hidden />
                <input value={objQ} onChange={(e) => setObjQ(e.target.value)} placeholder="Search objections…" aria-label="Search objections" className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm" /></div>
              <Select value={objId} onChange={(e) => { setObjId(e.target.value); setVariant("RECOMMENDED"); }} aria-label="Select what the customer says">
                <option value="">Choose an objection ({filteredObj.length})</option>
                {filteredObj.map((o) => <option key={o.id} value={o.id}>{o.customerSays}</option>)}
              </Select>
            </div>
            {selectedObj && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2"><Badge tone="brand">{OBJ_CATEGORIES[selectedObj.category]}</Badge><ApprovalBadge approval={selectedObj.approval} />
                  <div className="ml-auto flex gap-1" role="tablist" aria-label="Response length">
                    {(["RECOMMENDED", "SHORT", "DETAILED", "ALTERNATIVE"] as const).map((v) => <button key={v} role="tab" aria-selected={variant === v} onClick={() => setVariant(v)} className={cn("rounded-md px-2.5 py-1 text-xs font-medium", variant === v ? "bg-primary text-primary-foreground" : "bg-muted")}>{v[0] + v.slice(1).toLowerCase()}</button>)}
                  </div></div>
                <p className="script-text rounded-lg bg-muted p-4" style={{ fontSize: `${Math.max(16, size - 2)}px` }}>{selectedObj.responses[variant]}</p>
                <div className="flex flex-wrap items-center gap-2"><CopyButton text={selectedObj.responses[variant]} /><FavoriteButton kind="objection" id={selectedObj.id} initial={selectedObj.favorite} /></div>
                <p className="text-sm text-danger"><strong>Don’t say:</strong> {selectedObj.dontSay}</p>
              </div>
            )}
          </section>
        </div>

        {!focus && (
          <aside aria-label="Call helper" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5"><h2 className="mb-2 font-semibold">Suggested questions</h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">{g.questions.map((q) => <li key={q}>{q}</li>)}</ul></div>
            <div className="rounded-2xl bg-accent p-5 text-accent-foreground"><h2 className="mb-1 font-semibold">Tip</h2><p className="text-sm">{g.tip}</p></div>
            <div className="rounded-2xl border border-border bg-card p-5"><h2 className="mb-2 font-semibold">Related knowledge</h2>
              <Link className="text-sm text-primary underline" href={`/knowledge?q=${encodeURIComponent(g.knowledge)}`}>Search “{g.knowledge}”</Link></div>
            <div className="rounded-2xl border border-border bg-card p-5 text-sm"><h2 className="mb-2 font-semibold">Keyboard</h2>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1"><dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>Previous / next</dd><dt><kbd>A</kbd></dt><dd>Alternative wording</dd><dt><kbd>F</kbd></dt><dd>Focus mode</dd><dt><kbd>Esc</kbd></dt><dd>Exit focus</dd></dl></div>
          </aside>
        )}
      </div>
    </div>
  );
}
