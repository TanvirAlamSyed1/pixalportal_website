// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/login/signup', '/auth/callback'];
const PROFILE_FORM_ROUTE = '/login/completeform';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // ✅ Edge-safe cookie read
  const token = req.cookies.get('sb-access-token')?.value;

  const isPublic = PUBLIC_ROUTES.includes(path);
  const isProfileForm = path === PROFILE_FORM_ROUTE;

  if (!token && !isPublic && !isProfileForm) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// ✅ Match everything except static files
export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'],
  runtime: 'edge', // Add this line
};
