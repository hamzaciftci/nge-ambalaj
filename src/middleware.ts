import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";
// Note: logger can't be used in Edge middleware - using minimal console.error

// UUID v4 format validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Edge-compatible session validation using Neon serverless driver
 */
async function validateSession(sessionToken: string): Promise<boolean> {
  // First, validate token format (must be UUID v4)
  if (!UUID_REGEX.test(sessionToken)) {
    return false;
  }

  try {
    // Direct database query using Neon serverless (Edge-compatible)
    const sql = neon(process.env.STORAGE_DATABASE_URL_UNPOOLED!);

    const result = await sql`
      SELECT id, expires FROM "Session"
      WHERE "sessionToken" = ${sessionToken}
      LIMIT 1
    `;

    if (result.length === 0) {
      return false;
    }

    const session = result[0];
    const expires = new Date(session.expires);

    // Check if session has expired
    if (expires < new Date()) {
      // Session expired - could optionally delete it here
      return false;
    }

    return true;
  } catch (error) {
    // Log error but don't expose to client
    console.error("Session validation error:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiRoute = pathname.startsWith("/api");

  // Skip API routes - they handle their own auth via requireAuth()
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Admin route protection
  if (isAdminRoute) {
    const sessionToken = sessionCookie?.value;

    if (isLoginPage) {
      // If already logged in with valid session, redirect to dashboard
      if (sessionToken) {
        const isValid = await validateSession(sessionToken);
        if (isValid) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }
      // Allow access to login page
      return NextResponse.next();
    }

    // Protected admin routes - require valid session
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await validateSession(sessionToken);
    if (!isValid) {
      // Invalid or expired session - clear cookie and redirect
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
