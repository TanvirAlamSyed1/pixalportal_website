// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middleware/auth';

const publicRoutes = ['/login', '/login/signup', '/auth/callback'];
const profileIncompleteRoute = '/login/completeform';
const dashboardRoute = '/dashboard';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  const { user, supabase } = await authMiddleware(req, res);

  const isPublic = publicRoutes.includes(path);
  const isProfilePage = path === profileIncompleteRoute;

  if (!user && !isPublic && !isProfilePage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (user) {
    const { data: profile } = await supabase
      .from('User')
      .select('First_Name')
      .eq('User_ID', user.id)
      .maybeSingle();

    const nameMissing = !profile || !profile.First_Name?.trim?.();

    if (nameMissing && !isProfilePage) {
      return NextResponse.redirect(new URL(profileIncompleteRoute, req.url));
    }

    if (!nameMissing && (path === '/login' || path === '/login/signup' || path === profileIncompleteRoute)) {
      return NextResponse.redirect(new URL(dashboardRoute, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon|.*\\..*).*)'],
};
