import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsForm } from "./settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const [st] = await getDb().select().from(s.userSettings).where(eq(s.userSettings.userId, user.id)).limit(1);
  return (
    <>
      <PageHeader title="Settings" description="Your preferences. Theme is stored in this browser." />
      <SettingsForm email={user.email} name={user.name} role={user.role} initialSize={st?.scriptTextSize ?? 20} />
    </>
  );
}
