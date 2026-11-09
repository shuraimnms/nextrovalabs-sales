"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ADMIN_LINK, ADMIN_NAV, EMPLOYEE_NAV } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";
import { logoutAction } from "@/app/actions-auth";

type U = { name: string; email: string; role: string };

function isActive(path: string, href: string) {
  return path === href || (href !== "/dashboard" && href !== "/admin/dashboard" && path.startsWith(href + "/"));
}

export function AppShell({ isAdmin, user, children }: { isAdmin: boolean; user: U; children: React.ReactNode }) {
  const path = usePathname();
  const inAdmin = isAdmin && path.startsWith("/admin");
  const nav = inAdmin ? ADMIN_NAV.filter((n) => n.href !== "/admin/audit" || user.role === "SUPER_ADMIN") : isAdmin ? [...EMPLOYEE_NAV, ADMIN_LINK] : EMPLOYEE_NAV;
  const area = inAdmin ? "Admin" : "Employee";
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- close the mobile nav when the route changes
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((v) => !v); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const list = (
    <nav aria-label={`${area} navigation`} className="flex flex-col gap-1 px-3">
      {nav.map((n) => {
        const active = isActive(path, n.href);
        return (
          <Link key={n.href + n.label} href={n.href} aria-current={active ? "page" : undefined}
            className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-sidebar-active text-white" : "text-sidebar-foreground hover:bg-sidebar-active/60 hover:text-white")}>
            <n.icon className="size-4 shrink-0" aria-hidden /> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5 px-6 py-5">
      <span className="grid size-8 place-items-center rounded-lg text-white" style={{ background: "var(--grad)" }}><Sparkles className="size-4" aria-hidden /></span>
      <div className="leading-tight"><p className="text-sm font-semibold text-white">Nextrova Sales OS</p><p className="text-[11px] text-sidebar-foreground">{area} workspace</p></div>
    </div>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-sidebar lg:flex">
        {brand}
        <div className="flex-1 overflow-y-auto pb-4">{list}</div>
        <div className="border-t border-white/10 p-4">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-sidebar-foreground">{user.email}</p>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar">
            <div className="flex items-center justify-between">{brand}<button aria-label="Close menu" onClick={() => setOpen(false)} className="mr-3 rounded-md p-2 text-white"><X className="size-5" /></button></div>
            <div className="flex-1 overflow-y-auto pb-4">{list}</div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col pb-20 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-8">
          <button aria-label="Open menu" className="rounded-md p-2 hover:bg-muted lg:hidden" onClick={() => setOpen(true)}><Menu className="size-5" /></button>
          <button onClick={() => setPalette(true)} className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-card px-3 text-left text-sm text-muted-foreground hover:border-primary sm:max-w-md" aria-label="Search everything (Ctrl or Cmd + K)">
            <Search className="size-4 shrink-0" aria-hidden /><span className="truncate">Search scripts, objections, courses…</span>
            <kbd className="ml-auto hidden rounded border border-border px-1.5 text-[10px] sm:block">Ctrl K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <form action={logoutAction}>
              <button type="submit" className="grid size-9 place-items-center rounded-lg hover:bg-muted" aria-label="Sign out"><LogOut className="size-4" /></button>
            </form>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 grid border-t border-border bg-card lg:hidden" style={{ gridTemplateColumns: `repeat(${nav.filter((n) => n.mobile).length}, minmax(0,1fr))` }}>
        {nav.filter((n) => n.mobile).map((n) => {
          const active = isActive(path, n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
              <n.icon className="size-5" aria-hidden />{n.label}
            </Link>
          );
        })}
      </nav>
      <CommandPalette open={palette} onOpenChange={setPalette} />
    </div>
  );
}
