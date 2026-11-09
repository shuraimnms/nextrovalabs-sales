import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { saveTemplateAction } from "@/app/actions-admin";
import { EditorForm, type Field } from "@/components/admin/editor-form";
import { TEMPLATE_CATEGORIES } from "@/lib/labels";

export const metadata = { title: "Edit template" };
export default async function EditTemplate({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAdmin("content:write");
  const { id } = await params;
  const isNew = id === "new";
  const [t] = isNew ? [] : await getDb().select().from(s.whatsappTemplates).where(eq(s.whatsappTemplates.id, id)).limit(1);
  if (!isNew && !t) notFound();
  const fields: Field[] = [
    { name: "title", label: "Title", type: "text", max: 120 },
    { name: "category", label: "Category", type: "select", options: Object.entries(TEMPLATE_CATEGORIES).map(([value, label]) => ({ value, label })) },
    { name: "bodyHinglish", label: "Hinglish message", type: "textarea", rows: 6, hint: "Use placeholders like {{customer_name}}, {{employee_name}}, {{service}}, {{date}}, {{time}}, {{meeting_link}}, {{website_url}}." },
    { name: "bodyEnglish", label: "English message", type: "textarea", rows: 6 },
    { name: "approval", label: "Approval", type: "select", options: [{ value: "APPROVED", label: "Approved" }, { value: "PENDING_ADMIN_CONFIRMATION", label: "Pending admin confirmation" }] },
  ];
  return (<><PageHeader title={isNew ? "New template" : "Edit template"} /><div className="max-w-3xl"><EditorForm fields={fields} backHref="/admin/templates" initial={(t ?? { category: "FIRST_INTRODUCTION", approval: "APPROVED" })} action={async (v) => { "use server"; return saveTemplateAction(isNew ? null : id, v); }} /></div></>);
}
