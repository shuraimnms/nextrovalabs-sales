import { Sparkles } from "lucide-react";
import { isEmbedded } from "@/lib/db";

// On Vercel there is no persistent disk, so a PostgreSQL DATABASE_URL is required.
const needsDatabase = () => isEmbedded() && !!process.env.VERCEL;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_20%_-10%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent),radial-gradient(40rem_30rem_at_100%_100%,color-mix(in_srgb,var(--ring)_16%,transparent),transparent)]" />
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-[image:var(--grad)] text-white shadow-soft"><Sparkles className="size-5" aria-hidden /></span>
          <div className="leading-tight"><p className="text-lg font-semibold tracking-tight">Nextrova Sales OS</p><p className="text-xs text-muted-foreground">Nextrova Labs · internal use only</p></div>
        </div>
        {needsDatabase() ? (
          <div role="alert" className="rounded-xl border border-warning bg-warning-bg p-5 text-sm">
            <p className="font-medium">Database not connected yet</p>
            <p className="mt-1">This deployment is live but has no PostgreSQL database. In Vercel, open this project, go to <strong>Storage</strong>, add a Postgres database (for example Neon) and connect it to this project, then redeploy. Sign-in will work as soon as it is connected.</p>
          </div>
        ) : children}
      </div>
    </main>
  );
}
