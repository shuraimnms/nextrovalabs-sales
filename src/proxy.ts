import { NextResponse, type NextRequest } from "next/server";

/**
 * First-line gate only (cheap cookie presence check) so unauthenticated visitors never reach protected routes.
 * Real authorisation (session validity, suspension, role) is re-done server-side in every page, action and API route.
 */
const PUBLIC = ["/login", "/forgot-password", "/reset-password", "/api/health"];
const COOKIES = ["__Host-nsos_session", "nsos_session"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) return NextResponse.next();
  if (!COOKIES.some((c) => req.cookies.has(c))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|branding/|icons/|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|webmanifest)$).*)"],
};
