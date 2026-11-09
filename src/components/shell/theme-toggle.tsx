"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER = ["system", "light", "dark"] as const;
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard hydration-safe mounted flag
  useEffect(() => setMounted(true), []);
  const cur = (mounted ? theme : "system") ?? "system";
  const next = ORDER[(ORDER.indexOf(cur as (typeof ORDER)[number]) + 1) % ORDER.length];
  const Icon = cur === "dark" ? Moon : cur === "light" ? Sun : Monitor;
  return (
    <button onClick={() => setTheme(next)} className="grid size-9 place-items-center rounded-lg hover:bg-muted" aria-label={`Theme: ${cur}. Switch to ${next}`} title={`Theme: ${cur}`}>
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
