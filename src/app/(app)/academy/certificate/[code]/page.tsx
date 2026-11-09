import { notFound } from "next/navigation";
import Link from "next/link";
import { Award } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getCertificate } from "@/services/content.service";
import { PrintButton } from "./print-button";

export const metadata = { title: "Certificate" };

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const user = await requireUser();
  const c = await getCertificate(getDb(), user.id, code);
  if (!c) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex justify-between print:hidden"><Link href="/academy" className="text-sm text-muted-foreground hover:text-foreground">← Academy</Link><PrintButton /></div>
      <div className="rounded-2xl border-4 border-double border-primary bg-card p-8 text-center sm:p-14">
        <Award className="mx-auto size-12 text-primary" aria-hidden />
        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-muted-foreground">Nextrova Labs · Sales Academy</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Certificate of Completion</h1>
        <p className="mt-6 text-muted-foreground">This certifies that</p>
        <p className="mt-2 text-2xl font-semibold">{c.name}</p>
        <p className="mt-6 text-muted-foreground">has completed the course and passed its assessment</p>
        <p className="mt-2 text-xl font-semibold">{c.course}</p>
        <p className="mt-8 text-sm text-muted-foreground">Issued {c.issuedAt.toLocaleDateString("en-IN", { dateStyle: "long" })} · Certificate ID {c.code}</p>
        <p className="mt-2 text-xs text-muted-foreground">Internal training certificate. Not an external accreditation.</p>
      </div>
    </div>
  );
}
