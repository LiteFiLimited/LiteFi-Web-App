import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Map of public routes without 'auth/' prefix to their actual paths
  const routes: Record<string, string> = {
    '/login': '/auth/login',
    '/sign-up': '/auth/sign-up',
    '/verify-phone': '/auth/verify-phone',
    '/create-password': '/auth/create-password',
    '/reset-password': '/auth/reset-password',
    '/create-new-password': '/auth/create-new-password',
  };

  // If the path matches a route in our map, rewrite it
  if (routes[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = routes[pathname];
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Match all routes that should be handled by the middleware
export const config = {
  matcher: [
    '/login',
    '/sign-up',
    '/verify-phone',
    '/create-password',
    '/reset-password',
    '/create-new-password',
  ],
}; 