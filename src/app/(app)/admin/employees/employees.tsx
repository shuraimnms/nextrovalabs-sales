"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createResetLinkAction, createUserAction, deleteUserAction, setUserRoleAction, setUserStatusAction } from "@/app/actions-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { Input, Label, Select } from "@/components/ui/input";

type Row = { id: string; name: string; email: string; role: string; status: string; last: string | null };
const ROLE: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Admin", EMPLOYEE: "Employee" };

export function Employees({ rows, meId, meRole }: { rows: Row[]; meId: string; meRole: string }) {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });
  const [err, setErr] = useState<string | null>(null);
  const [link, setLink] = useState<{ id: string; url: string } | null>(null);
  const [pending, start] = useTransition();
  const act = (fn: () => Promise<{ ok: boolean }>) => start(async () => { setErr(null); const r = await fn(); if (!r.ok) setErr((r as unknown as { error: string }).error); else router.refresh(); });
  const isSuper = meRole === "SUPER_ADMIN";
  return (
    <div className="space-y-8">
      <form onSubmit={(e) => { e.preventDefault(); act(async () => { const r = await createUserAction(f); if (r.ok) setF({ name: "", email: "", password: "", role: "EMPLOYEE" }); return r; }); }} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Create user">
        <div><Label htmlFor="u-name">Name</Label><Input id="u-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required maxLength={100} className="mt-1" /></div>
        <div><Label htmlFor="u-email">Email</Label><Input id="u-email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required className="mt-1" autoComplete="off" /></div>
        <div><Label htmlFor="u-pw">Temporary password</Label><Input id="u-pw" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required minLength={10} autoComplete="new-password" className="mt-1" /></div>
        <div><Label htmlFor="u-role">Role</Label><Select id="u-role" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="mt-1"><option value="EMPLOYEE">Employee</option>{isSuper && <><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option></>}</Select></div>
        <div className="flex items-end"><Button type="submit" disabled={pending}>Create user</Button></div>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-5">Min 10 characters with upper, lower case and a digit. Share it privately; the user is forced to change it at first sign-in.</p>
      </form>
      {err && <p role="alert" className="text-sm text-danger">{err}</p>}
      {link && <div role="status" className="rounded-xl border border-warning bg-warning-bg p-4 text-sm"><p className="font-medium">Reset link (valid 30 minutes, single use). Share it privately:</p><p className="mt-1 break-all font-mono text-xs">{link.url}</p><div className="mt-2 flex gap-2"><CopyButton text={link.url} label="Copy link" /><Button size="sm" variant="ghost" onClick={() => setLink(null)}>Hide</Button></div></div>}
      <div tabIndex={0} role="region" aria-label="Users table" className="overflow-x-auto rounded-xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-ring">
        <table className="w-full text-sm"><caption className="sr-only">Users</caption>
          <thead className="border-b border-border text-left text-xs text-muted-foreground"><tr><th scope="col" className="p-3">Name</th><th scope="col" className="p-3">Role</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Last sign-in</th><th scope="col" className="p-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => { const me = r.id === meId; const manageable = !me && (isSuper || r.role === "EMPLOYEE"); return (
              <tr key={r.id}><td className="p-3"><p className="font-medium">{r.name}{me && " (you)"}</p><p className="text-xs text-muted-foreground">{r.email}</p></td>
                <td className="p-3">{isSuper && manageable ? <Select aria-label={`Role for ${r.name}`} value={r.role} disabled={pending} onChange={(e) => act(() => setUserRoleAction(r.id, e.target.value))} className="h-9 w-36"><option value="EMPLOYEE">Employee</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super Admin</option></Select> : ROLE[r.role]}</td>
                <td className="p-3"><Badge tone={r.status === "ACTIVE" ? "success" : "danger"}>{r.status === "ACTIVE" ? "Active" : "Suspended"}</Badge></td>
                <td className="p-3 text-xs text-muted-foreground">{r.last ? new Date(r.last).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Never"}</td>
                <td className="p-3">{manageable && <div className="flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => act(() => setUserStatusAction(r.id, r.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"))}>{r.status === "ACTIVE" ? "Suspend" : "Activate"}</Button>
                  <Button size="sm" variant="outline" disabled={pending} onClick={() => start(async () => { setErr(null); const x = await createResetLinkAction(r.id); if (x.ok) setLink({ id: r.id, url: x.link }); else setErr(x.error); })}>Reset link</Button>
                  <Button size="sm" variant="danger" disabled={pending} onClick={() => { if (window.confirm(`Delete ${r.name}? They will lose access immediately.`)) act(() => deleteUserAction(r.id)); }}>Delete</Button></div>}</td></tr>); })}
          </tbody></table>
      </div>
    </div>
  );
}
