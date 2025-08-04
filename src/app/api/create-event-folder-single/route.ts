import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { eventId, locationId } = await req.json();

  if (!eventId || !locationId) {
    return NextResponse.json({ error: 'Missing eventId or locationId' }, { status: 400 });
  }

  const key = `events/${eventId}/${locationId}/placeholder.txt`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: 'Placeholder to create folder',
    ContentType: 'text/plain',
  });

  try {
    await s3.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('S3 error:', error);
    return NextResponse.json({ error: 'S3 folder creation failed' }, { status: 500 });
  }
}
