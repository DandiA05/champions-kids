import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Get token from cookies
    const cookie = request.cookies.get(COOKIE_NAME);
    const token = cookie?.value;

    console.log(
      `Middleware tracing: pathname=${pathname}, cookieFound=${!!cookie}, tokenLength=${token?.length || 0}`,
    );

    if (!token) {
      console.log("Middleware: No token found. Redirecting to /admin/login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
      console.log(
        "Middleware: Token verification failed. Redirecting to /admin/login",
      );
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url),
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    console.log(
      `Middleware: Token verified for user=${payload.email}, role=${payload.role}`,
    );

    // Check if user is admin
    if (payload.role !== "admin") {
      console.log(
        `Middleware: Access denied (non-admin). role=${payload.role}`,
      );
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", request.url),
      );
    }

    // Token is valid and user is admin, allow access
    return NextResponse.next();
  }

  // If accessing /admin/login while already authenticated, redirect to dashboard
  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      const payload = await verifyToken(token);
      if (payload && payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*"],
};
