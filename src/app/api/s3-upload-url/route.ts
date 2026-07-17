// src/app/api/s3-upload-url/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const supabase = createServerComponentClient({ cookies });

    // Removed locationId from request body
    const { eventId, fileName, contentType } = await req.json();

    if (!eventId || !fileName || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify event ownership without checking locationId
    const { data: event, error } = await supabase
      .from('Event')
      .select('eventid')
      .eq('eventid', eventId)
      .maybeSingle();

    if (!event || error) {
      return NextResponse.json({ error: 'Invalid Event' }, { status: 403 });
    }

    // Updated path structure to exclude locationId
    const uniqueName = `${Date.now()}-${uuidv4()}-${fileName}`;
    const key = `events/${eventId}/${uniqueName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error('❌ S3 Upload Error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}