import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const PUBLIC_ROUTES = ['/login', '/signup', '/auth/callback'];
const PROFILE_FORM_ROUTE = '/login/completeform';

export async function middleware(req: NextRequest) {
  // Create response object
  const res = NextResponse.next();
  
  // Create Supabase client
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Check auth state
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = req.nextUrl.pathname;

    // Handle public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return res;
    }

    // Handle profile form route
    if (pathname === PROFILE_FORM_ROUTE) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return res;
    }

    // Protect all other routes
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)'],
  runtime: 'experimental-edge',
};