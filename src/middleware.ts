// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/login/signup', '/auth/callback'];
const PROFILE_FORM_ROUTE = '/login/completeform';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('sb-access-token')?.value;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isProfileFormPage = pathname === PROFILE_FORM_ROUTE;

  // 1. Block unauthenticated users from protected routes
  if (!token && !isPublicRoute && !isProfileFormPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Allow everything else
  return NextResponse.next();
}

// Ensure middleware runs on all routes except for static files and _next
export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'],
};
