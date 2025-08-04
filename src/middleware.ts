import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login', '/login/signup', '/auth/callback'];
const profileIncompleteRoute = '/login/completeform';
const dashboardRoute = '/dashboard';

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicRoutes.includes(path);
  const isProfilePage = path === profileIncompleteRoute;

  // Example: get a cookie that contains a session token
  const token = req.cookies.get('sb-access-token')?.value;

  if (!token && !isPublic && !isProfilePage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // You can't verify user profile in middleware anymore.
  // Do that in an API route or client-side fetch.
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon|.*\\..*).*)'],
};
