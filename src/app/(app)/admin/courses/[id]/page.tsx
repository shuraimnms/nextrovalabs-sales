import { notFound } from "next/navigation";
import { asc, eq, inArray } from "drizzle-orm";
import { requirePageAdmin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import * as s from "@/lib/db/schema";
import { PageHeader } from "@/components/shared/page-header";
import { saveCourseAction, saveLessonAction, saveQuestionAction } from "@/app/actions-admin";
import { EditorForm, type Field } from "@/components/admin/editor-form";
import { DIFFICULTY } from "@/lib/labels";

export const metadata = { title: "Edit course" };
export default async function EditCourse({ params }: { params: Promise<{ id: string }> }) {
  await requirePageAdmin("content:write");
  const { id } = await params;
  const db = getDb();
  const [c] = await db.select().from(s.courses).where(eq(s.courses.id, id)).limit(1);
  if (!c) notFound();
  const mods = await db.select().from(s.modules).where(eq(s.modules.courseId, id)).orderBy(asc(s.modules.sortOrder));
  const lessons = mods.length ? await db.select().from(s.lessons).where(inArray(s.lessons.moduleId, mods.map((m) => m.id))).orderBy(asc(s.lessons.sortOrder)) : [];
  const [quiz] = await db.select().from(s.quizzes).where(eq(s.quizzes.courseId, id)).limit(1);
  const qs = quiz ? await db.select().from(s.quizQuestions).where(eq(s.quizQuestions.quizId, quiz.id)).orderBy(asc(s.quizQuestions.sortOrder)) : [];

  const meta: Field[] = [
    { name: "title", label: "Title", type: "text", max: 160 }, { name: "summary", label: "Summary", type: "textarea", rows: 3 },
    { name: "level", label: "Level", type: "select", options: Object.entries(DIFFICULTY).map(([value, label]) => ({ value, label })) },
    { name: "passingScore", label: "Passing score (%)", type: "number" },
  ];
  const lessonFields: Field[] = [{ name: "title", label: "Title", type: "text", max: 160 }, { name: "minutes", label: "Minutes", type: "number" }, { name: "body", label: "Body", type: "textarea", rows: 8, hint: "Supports '- ' bullets, '1. ' lists and **bold**." }];
  const qFields: Field[] = [
    { name: "prompt", label: "Question", type: "textarea", rows: 2 },
    { name: "o0", label: "Option 1", type: "text" }, { name: "o1", label: "Option 2", type: "text" }, { name: "o2", label: "Option 3", type: "text" }, { name: "o3", label: "Option 4", type: "text" },
    { name: "correctIndex", label: "Correct option number (0 = Option 1, 1 = Option 2 …)", type: "number" },
    { name: "explanation", label: "Explanation", type: "textarea", rows: 2 },
  ];
  return (
    <>
      <PageHeader title={`Course ${c.number}: ${c.title}`} />
      <div className="max-w-3xl space-y-10">
        <section aria-labelledby="meta"><h2 id="meta" className="mb-3 text-lg font-semibold">Course details</h2>
          <EditorForm fields={meta} backHref="/admin/courses" initial={c} action={async (v) => { "use server"; return saveCourseAction(id, v); }} /></section>
        <section aria-labelledby="lessons"><h2 id="lessons" className="mb-3 text-lg font-semibold">Lessons ({lessons.length})</h2>
          <div className="space-y-2">{lessons.map((l) => (
            <details key={l.id} className="rounded-xl border border-border bg-card p-4"><summary className="cursor-pointer font-medium">{l.title}</summary>
              <div className="mt-4"><EditorForm fields={lessonFields} backHref="/admin/courses" initial={l} action={async (v) => { "use server"; return saveLessonAction(l.id, v); }} /></div></details>))}</div></section>
        <section aria-labelledby="quiz"><h2 id="quiz" className="mb-3 text-lg font-semibold">Quiz questions ({qs.length})</h2>
          <div className="space-y-2">{qs.map((q, i) => (
            <details key={q.id} className="rounded-xl border border-border bg-card p-4"><summary className="cursor-pointer font-medium">{i + 1}. {q.prompt}</summary>
              <div className="mt-4"><EditorForm fields={qFields} backHref="/admin/courses" initial={{ prompt: q.prompt, explanation: q.explanation, correctIndex: q.correctIndex, o0: q.options[0], o1: q.options[1], o2: q.options[2] ?? "", o3: q.options[3] ?? "" }}
                action={async (v) => { "use server"; return saveQuestionAction(q.id, { prompt: v.prompt, explanation: v.explanation, correctIndex: v.correctIndex, options: [v.o0, v.o1, v.o2, v.o3].filter((x) => typeof x === "string" && x.trim()) }); }} /></div></details>))}</div></section>
      </div>
    </>
  );
}
