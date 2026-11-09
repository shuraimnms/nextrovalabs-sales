import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { listScriptVersions } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { saveScriptAction } from "@/app/actions-admin";
import { EditorForm, type Field } from "@/components/admin/editor-form";
import { DIFFICULTY, SERVICES, STAGES } from "@/lib/labels";
import { VersionList } from "./version-list";

export const metadata = { title: "Edit script" };
const opts = (o: Record<string, string>, blank?: string) => [...(blank ? [{ value: "", label: blank }] : []), ...Object.entries(o).map(([value, label]) => ({ value, label }))];

export default async function EditScript({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAdmin("content:write");
  const { id } = await params;
  const db = getDb();
  const cats = await db.select().from(s.scriptCategories).orderBy(s.scriptCategories.sortOrder);
  const isNew = id === "new";
  const [sc] = isNew ? [] : await db.select().from(s.scripts).where(eq(s.scripts.id, id)).limit(1);
  if (!isNew && !sc) notFound();
  const versions = isNew ? [] : await listScriptVersions(db, id);
  const fields: Field[] = [
    { name: "title", label: "Title", type: "text", max: 160 },
    { name: "categoryId", label: "Category", type: "select", options: cats.map((c) => ({ value: c.id, label: c.name })) },
    { name: "service", label: "Service", type: "select", options: opts(SERVICES) },
    { name: "stage", label: "Call stage", type: "select", options: opts(STAGES, "— None —") },
    { name: "difficulty", label: "Difficulty", type: "select", options: opts(DIFFICULTY) },
    { name: "scenario", label: "Scenario (when to use)", type: "textarea", rows: 2 },
    { name: "recommended", label: "Recommended wording (Hinglish)", type: "textarea", rows: 6 },
    { name: "alternative", label: "Alternative wording", type: "textarea", rows: 5 },
    { name: "englishVersion", label: "English version", type: "textarea", rows: 4 },
    { name: "usageGuidance", label: "Usage guidance", type: "textarea", rows: 3 },
    { name: "thingsToAvoid", label: "Things to avoid", type: "textarea", rows: 3 },
    { name: "approval", label: "Approval", type: "select", options: [{ value: "APPROVED", label: "Approved" }, { value: "PENDING_ADMIN_CONFIRMATION", label: "Pending admin confirmation" }], hint: "Mark as pending when the script states a company policy that is not yet verified." },
    { name: "changeNote", label: "Change note (saved with the version)", type: "text", max: 200 },
  ];
  const initial = sc ? { ...sc, stage: sc.stage ?? "", alternative: sc.alternative ?? "", englishVersion: sc.englishVersion ?? "", changeNote: "" } : { categoryId: cats[0]?.id, service: "GENERAL", stage: "", difficulty: "BEGINNER", approval: "APPROVED" };
  return (
    <>
      <PageHeader title={isNew ? "New script" : `Edit: ${sc.title}`} description={isNew ? "New scripts start as drafts. Publish from the list." : `Version ${sc.version} · ${sc.status.toLowerCase().replace("_", " ")}`} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <EditorForm fields={fields} initial={initial} backHref="/admin/scripts" action={async (v) => { "use server"; return saveScriptAction(isNew ? null : id, v); }} />
        {!isNew && <VersionList scriptId={id} versions={versions.map((v) => ({ id: v.id, version: v.version, note: v.changeNote, by: v.by, at: v.createdAt.toISOString() }))} />}
      </div>
    </>
  );
}
