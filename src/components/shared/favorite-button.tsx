"use client";
import { Star } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions-content";
import { cn } from "@/lib/utils/cn";

export function FavoriteButton({ kind, id, initial, className }: { kind: "script" | "objection"; id: string; initial: boolean; className?: string }) {
  const [fav, setFav] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} aria-pressed={fav} aria-label={fav ? "Remove from favourites" : "Add to favourites"}
      onClick={() => { const prev = fav; setFav(!prev); start(async () => { const r = await toggleFavoriteAction(kind, id); if (!r.ok) setFav(prev); else if (typeof r.favorite === "boolean") setFav(r.favorite); }); }}
      className={cn("grid size-9 place-items-center rounded-lg hover:bg-muted", className)}>
      <Star className={cn("size-4", fav && "fill-warning text-warning")} aria-hidden />
    </button>
  );
}
