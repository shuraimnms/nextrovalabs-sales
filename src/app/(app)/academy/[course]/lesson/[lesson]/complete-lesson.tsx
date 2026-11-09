"use client";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeLessonAction } from "@/app/actions-content";
import { Button } from "@/components/ui/button";

export function CompleteLesson({ lessonId, courseSlug, done, nextHref, nextLabel }: { lessonId: string; courseSlug: string; done: boolean; nextHref: string; nextLabel: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [err, setErr] = useState(false);
  if (done) return <p className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="size-5" aria-hidden />Lesson completed</p>;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled={pending} onClick={() => start(async () => { const r = await completeLessonAction(lessonId, courseSlug); if (!r.ok) setErr(true); else { setErr(false); router.push(nextHref); router.refresh(); } })}>
        {pending ? "Saving…" : `Mark complete and continue`}
      </Button>
      <span className="sr-only">{nextLabel}</span>
      {err && <span role="alert" className="text-sm text-danger">Could not save your progress. Please try again.</span>}
    </div>
  );
}
