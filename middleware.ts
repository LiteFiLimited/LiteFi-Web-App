import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This tells Next.js that this middleware should be included in the static export
export const dynamic = 'force-static';

// For static exports, we need to completely disable the middleware
// This is a dummy middleware that does nothing
export function middleware(request: NextRequest) {
  // Always return NextResponse.next() in production
  return NextResponse.next();
}

// Configure which routes the middleware should run on - empty for production
export const config = {
  matcher: [],
};
