"use client";
import * as D from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

type Hit = { type: string; title: string; subtitle: string; href: string };
const QUICK: Hit[] = [
  { type: "Go to", title: "Live Call Companion", subtitle: "Guided call scripts", href: "/live-call" },
  { type: "Go to", title: "Script Library", subtitle: "100+ Hinglish scripts", href: "/scripts" },
  { type: "Go to", title: "Objection Center", subtitle: "Ready responses", href: "/objections" },
  { type: "Go to", title: "Academy", subtitle: "Courses and quizzes", href: "/academy" },
  { type: "Go to", title: "WhatsApp Templates", subtitle: "Copy and personalise", href: "/templates" },
  { type: "Go to", title: "Knowledge Base", subtitle: "Company information", href: "/knowledge" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the palette when it closes
    if (!open) { setQ(""); setHits([]); }
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear stale results for short queries before the debounced fetch
    if (q.trim().length < 2) { setHits([]); return; }
    const id = ++seq.current;
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { credentials: "same-origin" });
        const j = r.ok ? ((await r.json()) as { results: Hit[] }) : { results: [] };
        if (id === seq.current) setHits(j.results);
      } catch { if (id === seq.current) setHits([]); }
      finally { if (id === seq.current) setBusy(false); }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  const go = (href: string) => { onOpenChange(false); router.push(href); };
  const list = q.trim().length < 2 ? QUICK : hits;

  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-[60] bg-black/50" />
        <D.Content aria-describedby={undefined} className="fixed left-1/2 top-[12vh] z-[61] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <D.Title className="sr-only">Search</D.Title>
          <Command shouldFilter={false} label="Global search">
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <Command.Input value={q} onValueChange={setQ} placeholder="Search scripts, objections, templates, courses…" className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <Command.List className="max-h-[50vh] overflow-y-auto p-2">
              {busy && <div className="px-3 py-2 text-sm text-muted-foreground" role="status">Searching…</div>}
              {!busy && q.trim().length >= 2 && hits.length === 0 && <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">No results for “{q}”.</Command.Empty>}
              {list.map((h) => (
                <Command.Item key={h.href + h.title} value={h.href + h.title} onSelect={() => go(h.href)} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground">
                  <span className="w-20 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h.type}</span>
                  <span className="min-w-0"><span className="block truncate font-medium">{h.title}</span><span className="block truncate text-xs text-muted-foreground">{h.subtitle}</span></span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
