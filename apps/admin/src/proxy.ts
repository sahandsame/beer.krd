import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login", "/invite"];

/** Cheap cookie check; every page still verifies the session against the DB (lib/session.ts). */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return NextResponse.next();
  if (!getSessionCookie(req, { cookiePrefix: "beer" })) {
    const url = new URL("/login", req.url);
    if (pathname !== "/") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api/health|_next|icon.svg|favicon.ico).*)"],
};
