import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/auth/callback'];
const PROFILE_FORM_ROUTE = '/login/completeform';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = req.nextUrl.pathname;

  // 1. Handle public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return response;
  }

  // 2. Handle profile form route
  if (pathname === PROFILE_FORM_ROUTE) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return response;
  }

  // 3. Protect all other routes
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)'],
  runtime: 'experimental-edge',
};