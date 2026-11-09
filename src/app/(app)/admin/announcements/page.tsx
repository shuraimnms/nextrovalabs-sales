import { desc } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { AnnouncementsAdmin } from "./announcements-admin";

export const metadata = { title: "Announcements" };
export default async function AdminAnnouncements() {
  await requirePageAdmin("announcements:publish");
  const rows = await getDb().select().from(s.announcements).orderBy(desc(s.announcements.createdAt)).limit(100);
  return (<><PageHeader title="Announcements" description="Published announcements appear on every employee's dashboard." />
    <AnnouncementsAdmin rows={rows.map((r) => ({ id: r.id, title: r.title, body: r.body, priority: r.priority, status: r.status, at: r.createdAt.toISOString() }))} /></>);
}
