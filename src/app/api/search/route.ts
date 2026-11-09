import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { globalSearch } from "@/services/content.service";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.mustChangePassword) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.length > 100) return NextResponse.json({ results: [] });
  return NextResponse.json({ results: await globalSearch(getDb(), q) }, { headers: { "Cache-Control": "private, no-store" } });
}
