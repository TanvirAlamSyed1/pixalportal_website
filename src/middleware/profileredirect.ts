import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient, User } from '@supabase/supabase-js';

const publicRoutes = ['/login', '/login/signup', '/auth/callback'];

export async function profileRedirect(
  req: NextRequest,
  user: User | null,
  supabase: SupabaseClient
) {
  const path = req.nextUrl.pathname;

  if (!user && !publicRoutes.includes(path) && path !== '/login/completeform') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

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

    if (publicRoutes.includes(path)) {
      if (nameMissing) return NextResponse.redirect(new URL('/login/completeform', req.url));
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (nameMissing && path !== '/login/completeform') {
      return NextResponse.redirect(new URL('/login/completeform', req.url));
    }

    if (!nameMissing && (path === '/login/completeform' || path === '/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return null; // Allow through
}
