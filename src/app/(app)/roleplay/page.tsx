import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { recentSessions, aiAvailable } from "@/services/roleplay.service";
import { PageHeader } from "@/components/shared/page-header";
import { PERSONALITIES, PROJECTS } from "@/lib/roleplay/engine";
import { Simulator } from "./simulator";

export const metadata = { title: "Roleplay Simulator" };

export default async function RoleplayPage() {
  const user = await requireUser();
  const sessions = await recentSessions(getDb(), user.id);
  return (
    <>
      <PageHeader title="Roleplay Simulator" description="Practise a customer conversation and get feedback on six skills. Only your scores are saved — never the conversation." />
      <Simulator
        aiEnabled={aiAvailable()}
        personalities={Object.entries(PERSONALITIES).map(([k, v]) => ({ key: k, ...v }))}
        projects={Object.entries(PROJECTS).map(([k, v]) => ({ key: k, label: v }))}
        history={sessions.map((s) => ({ id: s.id, personality: PERSONALITIES[s.personality as keyof typeof PERSONALITIES]?.label ?? s.personality, project: PROJECTS[s.projectType as keyof typeof PROJECTS] ?? s.projectType, difficulty: s.difficulty, mode: s.mode, overall: (s.scores as { overall: number }).overall, at: s.createdAt.toISOString() }))}
      />
    </>
  );
}
