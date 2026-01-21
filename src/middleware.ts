import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  // Skip API routes
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing admin routes without session
  if (isAdminRoute && !isLoginPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (isLoginPage && sessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
