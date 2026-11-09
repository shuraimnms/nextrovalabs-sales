import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { saveArticleAction } from "@/app/actions-admin";
import { EditorForm, type Field } from "@/components/admin/editor-form";
import { SECTIONS } from "@/content/knowledge";

export const metadata = { title: "Edit article" };
export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAdmin("content:write");
  const { id } = await params;
  const isNew = id === "new";
  const [a] = isNew ? [] : await getDb().select().from(s.knowledgeArticles).where(eq(s.knowledgeArticles.id, id)).limit(1);
  if (!isNew && !a) notFound();
  const fields: Field[] = [
    { name: "title", label: "Title", type: "text", max: 160 },
    { name: "section", label: "Section", type: "select", options: SECTIONS.map((x) => ({ value: x, label: x })) },
    { name: "body", label: "Body", type: "textarea", rows: 14, hint: "Plain text. Use '- ' for bullets, '1. ' for numbered lists and **bold**. Only verified company facts." },
    { name: "approval", label: "Approval", type: "select", options: [{ value: "APPROVED", label: "Approved" }, { value: "PENDING_ADMIN_CONFIRMATION", label: "Pending admin confirmation" }] },
  ];
  return (<><PageHeader title={isNew ? "New article" : "Edit article"} /><div className="max-w-3xl"><EditorForm fields={fields} backHref="/admin/knowledge" initial={(a ?? { section: SECTIONS[0], approval: "APPROVED" })} action={async (v) => { "use server"; return saveArticleAction(isNew ? null : id, v); }} /></div></>);
}
