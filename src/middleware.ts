import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middleware/auth';
import { profileRedirect } from './middleware/profileredirect';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const { user, supabase } = await authMiddleware(req, res);
  const redirect = await profileRedirect(req, user, supabase);

  return redirect || res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
};
