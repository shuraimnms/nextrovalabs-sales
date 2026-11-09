"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState, useTransition } from "react";
import { saveSettingsAction } from "@/app/actions-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label, Select } from "@/components/ui/input";

export function SettingsForm({ email, name, role, initialSize }: { email: string; name: string; role: string; initialSize: number }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration-safe mounted flag
  useEffect(() => setMounted(true), []);
  const [size, setSize] = useState(initialSize);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="grid max-w-2xl gap-5">
      <Card><CardHeader><CardTitle>Account</CardTitle></CardHeader><CardContent className="space-y-1 text-sm"><p><strong>{name}</strong></p><p className="text-muted-foreground">{email} · {role.replace("_", " ").toLowerCase()}</p><Button asChild variant="outline" size="sm" className="mt-3"><Link href="/change-password">Change password</Link></Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Appearance</CardTitle></CardHeader><CardContent>
        <Label htmlFor="theme">Theme</Label>
        <Select id="theme" value={mounted ? theme ?? "system" : "system"} onChange={(e) => setTheme(e.target.value)} className="mt-1 max-w-xs"><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></Select>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Live Call script text</CardTitle></CardHeader><CardContent>
        <form onSubmit={(e) => { e.preventDefault(); setMsg(null); start(async () => { const r = await saveSettingsAction({ scriptTextSize: size }); setMsg(r.ok ? "Saved." : r.error); }); }} className="space-y-3">
          <Label htmlFor="size">Default size: {size}px</Label>
          <input id="size" type="range" min={14} max={40} step={2} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          <p className="script-text rounded-lg bg-muted p-3" style={{ fontSize: size }}>Namaste sir, main Nextrova Labs se bol raha hoon.</p>
          <div className="flex items-center gap-3"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</Button>{msg && <span role="status" className="text-sm text-muted-foreground">{msg}</span>}</div>
        </form>
      </CardContent></Card>
    </div>
  );
}
