import { Fragment } from "react";

/** Tiny, safe renderer for our seed/CMS content: paragraphs, "- " lists, "1. " lists, "> " quotes, **bold**. No raw HTML is ever injected. */
function inline(t: string) {
  return t.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>));
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={className ?? "space-y-4 leading-relaxed"}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("> "))) {
          return <blockquote key={i} className="rounded-r-lg border-l-4 border-warning bg-warning-bg px-4 py-3 text-sm text-warning">{inline(lines.map((l) => l.slice(2)).join(" "))}</blockquote>;
        }
        if (lines.every((l) => /^- /.test(l))) {
          return <ul key={i} className="list-disc space-y-1 pl-5">{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        }
        if (lines.every((l) => /^\d+[.)] /.test(l))) {
          return <ol key={i} className="list-decimal space-y-1 pl-5">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+[.)] /, ""))}</li>)}</ol>;
        }
        return <p key={i} className="whitespace-pre-line">{inline(b)}</p>;
      })}
    </div>
  );
}
