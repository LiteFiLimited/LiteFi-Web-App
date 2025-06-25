import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This tells Next.js that this middleware should be included in the static export
export const dynamic = 'force-static';

// Skip middleware execution during static export build
// This allows the project to be built with "output: export"
export function middleware(request: NextRequest) {
  // Skip middleware in production (static export)
  // This is critical for static exports
  if (process.env.NODE_ENV === "production" || process.env.NEXT_EXPORT === "true") {
    return NextResponse.next();
  }
  
  // Only run middleware in development
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/sign-up",
    "/auth/verify-phone",
    "/auth/create-password",
    "/auth/reset-password",
    "/auth/create-new-password",
    "/terms",
    "/privacy",
    "/login",
    "/sign-up",
    "/verify-phone",
    "/create-password",
    "/reset-password",
    "/create-new-password",
  ];

  // Define API routes that don't require authentication
  const publicApiRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/verify-email",
    "/api/auth/verify-phone",
    "/api/auth/verify-phone-otp",
    "/api/auth/send-phone-otp",
    "/api/auth/resend-otp",
    "/api/auth/resend-verification",
    "/api/auth/reset-password",
    "/api/auth/confirm-reset",
  ];

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/wallet",
    "/loans",
    "/investments",
    "/settings",
  ];

  // Map of public routes without 'auth/' prefix to their actual paths
  const routeMap: Record<string, string> = {
    "/login": "/auth/login",
    "/sign-up": "/auth/sign-up",
    "/verify-phone": "/auth/verify-phone",
    "/create-password": "/auth/create-password",
    "/reset-password": "/auth/reset-password",
    "/create-new-password": "/auth/create-new-password",
  };

  // Handle route rewrites for public routes
  if (routeMap[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = routeMap[pathname];
    return NextResponse.rewrite(url);
  }

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the current path is a public API route
  const isPublicApiRoute = publicApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow public routes and public API routes
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute || pathname.startsWith("/dashboard")) {
    // Check for authentication token in cookies
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      // No token found, redirect to login with the original URL as redirect parameter
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, allow access
    return NextResponse.next();
  }

  // For all other routes, allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes that don't need auth check)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|assets|logo|public).*)",
  ],
};
