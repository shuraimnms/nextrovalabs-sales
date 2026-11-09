import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_20%_-10%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent),radial-gradient(40rem_30rem_at_100%_100%,color-mix(in_srgb,var(--ring)_16%,transparent),transparent)]" />
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--grad)] text-white shadow-soft"><Sparkles className="size-5" aria-hidden /></span>
          <div className="leading-tight"><p className="text-lg font-semibold tracking-tight">Nextrova Sales OS</p><p className="text-xs text-muted-foreground">Nextrova Labs · internal use only</p></div>
        </div>
        {children}
      </div>
    </main>
  );
}
