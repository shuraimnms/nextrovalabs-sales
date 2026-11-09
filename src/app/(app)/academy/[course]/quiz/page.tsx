import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getQuiz } from "@/services/content.service";
import { QuizRunner } from "./quiz-runner";

export default async function QuizPage({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  await requireUser();
  const q = await getQuiz(getDb(), course);
  if (!q) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/academy/${course}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden />{q.course.title}</Link>
      <h1 className="text-2xl font-semibold tracking-tight">{q.quiz.title}</h1>
      <p className="text-sm text-muted-foreground">Pass mark {q.quiz.passingScore}%. A certificate is issued when you pass after completing every lesson.</p>
      <QuizRunner courseSlug={course} quizId={q.quiz.id} questions={q.questions.map((x) => ({ id: x.id, prompt: x.prompt, options: x.options }))} />
    </div>
  );
}
