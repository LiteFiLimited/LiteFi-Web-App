import { NextResponse } from 'next/server';

// This file is only a placeholder for static export
// It does nothing and will be completely ignored during build

export const dynamic = 'force-static';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
