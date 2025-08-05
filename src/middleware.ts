// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/login/signup', '/auth/callback'];
const PROFILE_FORM_ROUTE = '/login/completeform';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Safe cookie check — no Supabase
  const token = req.cookies.get('sb-access-token')?.value;

  const isPublic = PUBLIC_ROUTES.includes(path);
  const isProfileForm = path === PROFILE_FORM_ROUTE;

  // Block unauthenticated users from protected pages
  if (!token && !isPublic && !isProfileForm) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'],
};
