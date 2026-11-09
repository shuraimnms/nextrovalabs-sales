"use client";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text, label = "Copy", size = "sm", variant = "outline" }: { text: string; label?: string; size?: "sm" | "md" | "lg"; variant?: "outline" | "primary" | "secondary" | "ghost" }) {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true); setErr(false);
      setTimeout(() => setDone(false), 1600);
    } catch {
      // Fallback for browsers/contexts without the async clipboard API.
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
        setDone(true); setTimeout(() => setDone(false), 1600);
      } catch { setErr(true); }
    }
  }
  return (
    <Button type="button" variant={variant} size={size} onClick={copy} aria-live="polite">
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      {done ? "Copied" : err ? "Press Ctrl+C" : label}
    </Button>
  );
}
