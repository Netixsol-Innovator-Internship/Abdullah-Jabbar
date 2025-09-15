import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Check if user has authentication token
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization");

    if (!token) {
      // No token found, redirect to login
      console.log("Middleware: No auth token found for dashboard access");
      return NextResponse.redirect(new URL("/authForm", request.url));
    }

    // Note: We can't decode JWT on the edge without additional libraries
    // So we'll rely on the client-side AdminGuard for role checking
    // This middleware primarily protects against direct URL access without any token
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
