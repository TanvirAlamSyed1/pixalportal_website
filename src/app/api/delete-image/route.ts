// src/app/api/delete-image/route.ts
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    // Removed locationId from the request body
    const { eventId, imageId } = await req.json();

    if (!eventId || !imageId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Updated key structure to exclude locationId
    const key = `events/${eventId}/${imageId}`;

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