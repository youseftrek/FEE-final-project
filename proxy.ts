import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token");
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/complete-profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes that should redirect to dashboard if already logged in
  const authRoutes = ["/auth/signin", "/auth/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Check if route is protected and user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Verify token for protected routes
  if (isProtectedRoute && token) {
    const decoded = verifyToken(token.value);
    if (!decoded) {
      const response = NextResponse.redirect(
        new URL("/auth/signin", request.url)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (isAuthRoute && token) {
    const decoded = verifyToken(token.value);
    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/complete-profile/:path*",
    "/auth/signin",
    "/auth/signup",
  ],
};
