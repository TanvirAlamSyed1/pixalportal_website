import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json(); // ✅ you MUST parse the body like this
  const { firstName, surname } = body;

  console.log('✅ Incoming POST to complete-profile with:', { firstName, surname, userId: user.id });

  const { error } = await supabase
    .from('User')
    .update({ First_Name: firstName, Surname: surname })
    .eq('User_ID', user.id);

  if (error) {
    console.error('❌ Supabase update error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
