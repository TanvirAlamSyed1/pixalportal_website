import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicRoutes = ['/login', '/signup', '/auth/callback'];
  const path = req.nextUrl.pathname;

  // Not logged in and trying to access a protected page
  if (!user && !publicRoutes.includes(path) && path !== '/completeform') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Logged in - check if profile is complete
  if (user) {
    const { data: profile } = await supabase
      .from('User')
      .select('First_Name')
      .eq('User_ID', user.id)
      .maybeSingle();

    const nameMissing = !profile || !profile.First_Name?.trim?.();
    console.log('📍 Current path:', path);
    console.log('🧠 Authenticated user:', user?.id);
    console.log('👤 Profile:', profile);
    console.log('🧪 nameMissing =', nameMissing);


    // Logged in and on a public page — redirect accordingly
    if (publicRoutes.includes(path)) {
      if (nameMissing) return NextResponse.redirect(new URL('/completeform', req.url));
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Logged in but missing profile — force to /completeform
    if (nameMissing && path !== '/completeform') {
      return NextResponse.redirect(new URL('/completeform', req.url));
    }

    // Logged in and has profile but is on /completeform — redirect to dashboard
    if (!nameMissing && path === '/completeform') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Logged in and has profile but is on /completeform — redirect to dashboard
    if (!nameMissing && path === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  

  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'], // matches all routes except static
};
