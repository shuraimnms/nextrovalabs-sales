"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CourseChart({ data }: { data: { name: string; title: string; avg: number }[] }) {
  return (
    <figure>
      <div className="h-64 w-full" role="img" aria-label={`Bar chart of average quiz score by course: ${data.map((d) => `${d.title} ${d.avg} percent`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <Tooltip formatter={(v) => [`${v}%`, "Average score"]} labelFormatter={(_, p) => p?.[0]?.payload?.title ?? ""} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }} />
            <Bar dataKey="avg" fill="var(--primary)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">Average quiz scores by course</figcaption>
    </figure>
  );
}
