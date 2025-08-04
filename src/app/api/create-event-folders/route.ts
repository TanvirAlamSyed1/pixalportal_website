import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// ✅ Supabase client using service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ Full access key
);

// ✅ AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const todayEnd = dayjs().endOf('day').toISOString();
    console.log('🗓️ Comparing StartDate <=', todayEnd);

    // 🔍 Log all events for verification
    const { data: allEvents, error: allEventsError } = await supabase
      .from('Event')
      .select('EventID, StartDate, S3FolderCreated');

    if (allEventsError) {
      console.error('❌ Error fetching all events:', allEventsError.message);
    } else {
      console.log('🧪 All Events:', allEvents);
    }

    // ✅ Get eligible events
    const { data: events, error } = await supabase
      .from('Event')
      .select(`
        EventID,
        S3FolderCreated,
        StartDate,
        EventLocation (
          EventLocID
        )
      `)
      .eq('S3FolderCreated', false)
      .lte('StartDate', todayEnd);

    if (error) {
      console.error('❌ Supabase query error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('📦 Events found:', events?.length || 0);
    if (!events || events.length === 0) {
      return NextResponse.json({ message: 'No events need folders' });
    }

    for (const event of events) {
      const eventFolder = `events/${event.EventID}/`;
      console.log('📁 Creating event folder:', eventFolder);

      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: eventFolder,
        Body: '',
      }));

      for (const loc of event.EventLocation || []) {
        const locFolder = `${eventFolder}${loc.EventLocID}/`;
        console.log('➡️ Creating location subfolder:', locFolder);

        await s3.send(new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: locFolder,
          Body: '',
        }));
      }

      // ✅ Update event to mark folders as created
      await supabase
        .from('Event')
        .update({ S3FolderCreated: true })
        .eq('EventID', event.EventID);

      console.log('✅ Event updated:', event.EventID);
    }

    return NextResponse.json({ message: 'S3 folders created' });
  } catch (err: any) {
    console.error('❌ Unexpected error:', err.message);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
