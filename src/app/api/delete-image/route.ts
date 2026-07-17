// src/app/api/delete-image/route.ts
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { verifyEventOwner } from '@/lib/verifyEventOwner';
 
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
 
export async function POST(req: Request) {
  try {
    // The dashboard's image list already gives us the full S3 key (that's
    // what list-images returns), so we take that directly rather than a
    // separate imageId that has to be re-assembled into a key.
    const { eventId, key } = await req.json();
 
    if (!eventId || !key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    // Only an authenticated owner of this event may delete its images.
    const auth = await verifyEventOwner(eventId);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
 
    // Belt-and-braces: never let a request delete something outside the
    // event's own folder, regardless of what key was passed in.
    const expectedPrefix = `events/${eventId}/`;
    if (!key.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: 'Invalid image key for this event' }, { status: 400 });
    }
 
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }));
 
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('S3 delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}