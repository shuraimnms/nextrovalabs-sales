import { asc, isNull } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { AdminList } from "@/components/admin/list-table";
import { DIFFICULTY } from "@/lib/labels";

export const metadata = { title: "Manage courses" };
export default async function AdminCourses() {
  await requirePageAdmin("content:read");
  const rows = await getDb().select().from(s.courses).where(isNull(s.courses.deletedAt)).orderBy(asc(s.courses.number));
  return (<><PageHeader title="Courses" description="Edit lessons and quiz questions, and publish or unpublish courses." />
    <AdminList entity="course" editBase="/admin/courses" rows={rows.map((r) => ({ id: r.id, title: `Course ${r.number}: ${r.title}`, status: r.status, meta: DIFFICULTY[r.level] }))} /></>);
}
