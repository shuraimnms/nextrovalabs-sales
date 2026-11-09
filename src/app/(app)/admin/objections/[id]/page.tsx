import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { saveObjectionAction } from "@/app/actions-admin";
import { EditorForm, type Field } from "@/components/admin/editor-form";
import { OBJ_CATEGORIES } from "@/lib/labels";

export const metadata = { title: "Edit objection" };
const APPROVAL = [{ value: "APPROVED", label: "Approved" }, { value: "PENDING_ADMIN_CONFIRMATION", label: "Pending admin confirmation" }];

export default async function EditObjection({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAdmin("content:write");
  const { id } = await params;
  const db = getDb();
  const isNew = id === "new";
  const [o] = isNew ? [] : await db.select().from(s.objections).where(eq(s.objections.id, id)).limit(1);
  if (!isNew && !o) notFound();
  const resp = isNew ? [] : await db.select().from(s.objectionResponses).where(eq(s.objectionResponses.objectionId, id));
  const r = Object.fromEntries(resp.map((x) => [x.variant, x.body]));
  const fields: Field[] = [
    { name: "customerSays", label: "Customer says", type: "text", max: 200 },
    { name: "category", label: "Category", type: "select", options: Object.entries(OBJ_CATEGORIES).map(([value, label]) => ({ value, label })) },
    { name: "popular", label: "Mark as popular", type: "checkbox" },
    { name: "RECOMMENDED", label: "Recommended response", type: "textarea", rows: 5 },
    { name: "SHORT", label: "Short response", type: "textarea", rows: 3 },
    { name: "DETAILED", label: "Detailed response", type: "textarea", rows: 6 },
    { name: "ALTERNATIVE", label: "Alternative response", type: "textarea", rows: 4 },
    { name: "whyItWorks", label: "Why it works", type: "textarea", rows: 3 },
    { name: "dontSay", label: "What not to say", type: "textarea", rows: 3 },
    { name: "approval", label: "Approval", type: "select", options: APPROVAL },
  ];
  return (<><PageHeader title={isNew ? "New objection" : "Edit objection"} />
    <div className="max-w-3xl"><EditorForm fields={fields} backHref="/admin/objections" initial={(o ? { ...o, ...r } : { category: "PRICE", approval: "APPROVED", popular: false })} action={async (v) => { "use server"; return saveObjectionAction(isNew ? null : id, v); }} /></div></>);
}
