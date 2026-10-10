import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Thin redirect only. Real validation happens in requireAdmin() (src/lib/auth/session.ts).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/setup")) {
    return NextResponse.next();
  }
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
