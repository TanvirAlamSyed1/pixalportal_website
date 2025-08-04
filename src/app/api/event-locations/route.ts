import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });

  const { data, error } = await supabase
    .from('EventLocation')
    .select('EventLocID, Name')
    .eq('EventID', eventId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
