"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { submitQuizAction } from "@/app/actions-content";
import { Button } from "@/components/ui/button";

type Q = { id: string; prompt: string; options: string[] };
type Result = { scorePct: number; passed: boolean; passingScore: number; certificateCode: string | null; review: { id: string; chosen: number; correct: number; ok: boolean; explanation: string }[] };

export function QuizRunner({ courseSlug, quizId, questions }: { courseSlug: string; quizId: string; questions: Q[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const answered = Object.keys(answers).length;

  function submit() {
    setError(null);
    start(async () => {
      const r = await submitQuizAction({ quizId, answers });
      if (!r.ok) setError(r.error); else { setResult(r); window.scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  if (result) {
    return (
      <div className="space-y-5">
        <div role="status" className={`rounded-xl p-5 ${result.passed ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`}>
          <p className="text-2xl font-semibold">{result.scorePct}% — {result.passed ? "Passed" : "Not passed yet"}</p>
          <p className="text-sm">{result.passed ? (result.certificateCode ? "Certificate issued." : "Complete all lessons to receive your certificate.") : `You need ${result.passingScore}% to pass. Review the explanations and try again.`}</p>
        </div>
        <ol className="space-y-4">
          {questions.map((q, i) => { const r = result.review.find((x) => x.id === q.id)!; return (
            <li key={q.id} className="rounded-xl border border-border bg-card p-4">
              <p className="flex items-start gap-2 font-medium">{r.ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-label="Correct" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-label="Incorrect" />}<span>{i + 1}. {q.prompt}</span></p>
              <p className="mt-2 text-sm">Your answer: {r.chosen >= 0 ? q.options[r.chosen] : "No answer"}</p>
              {!r.ok && <p className="text-sm text-success">Correct answer: {q.options[r.correct]}</p>}
              <p className="mt-2 text-sm text-muted-foreground">{r.explanation}</p>
            </li>); })}
        </ol>
        <div className="flex flex-wrap gap-2">
          {result.certificateCode && <Button asChild><Link href={`/academy/certificate/${result.certificateCode}`}><Award />View certificate</Link></Button>}
          <Button variant="outline" onClick={() => { setResult(null); setAnswers({}); }}>Retake</Button>
          <Button asChild variant="outline"><Link href={`/academy/${courseSlug}`}>Back to course</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-5">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="rounded-xl border border-border bg-card p-4">
          <legend className="px-1 font-medium">{i + 1}. {q.prompt}</legend>
          <div className="mt-2 space-y-2">
            {q.options.map((o, oi) => (
              <label key={oi} className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent">
                <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers((p) => ({ ...p, [q.id]: oi }))} className="size-4 accent-[var(--primary)]" />{o}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <div className="flex items-center gap-3"><Button type="submit" disabled={pending || answered < questions.length}>{pending ? "Submitting…" : "Submit answers"}</Button><span className="text-sm text-muted-foreground">{answered} of {questions.length} answered</span></div>
    </form>
  );
}
