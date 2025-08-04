import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/login/signup', '/auth/callback'];
const profileIncompleteRoute = '/login/completeform';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Read token from cookie (no async)
  const token = req.cookies.get('sb-access-token')?.value;

  const isPublic = publicRoutes.includes(path);
  const isProfilePage = path === profileIncompleteRoute;

  if (!token && !isPublic && !isProfilePage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon|.*\\..*).*)'],
};
