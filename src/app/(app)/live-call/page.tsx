import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { listObjections } from "@/services/content.service";
import { LiveCall } from "./live-call";

export const metadata = { title: "Live Call Companion" };

export default async function LiveCallPage() {
  const user = await requireUser();
  const db = getDb();
  const [objections, settings] = await Promise.all([
    listObjections(db, user.id),
    db.select().from(s.userSettings).where(eq(s.userSettings.userId, user.id)).limit(1),
  ]);
  return (
    <LiveCall
      initialTextSize={settings[0]?.scriptTextSize ?? 20}
      objections={objections.map((o) => ({ id: o.id, customerSays: o.customerSays, category: o.category, favorite: o.favorite, approval: o.approval, dontSay: o.dontSay, responses: o.responses }))}
    />
  );
}
