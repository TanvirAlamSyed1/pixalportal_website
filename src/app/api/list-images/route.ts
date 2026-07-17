// src/app/api/list-images/route.ts
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextRequest, NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');

  // Removed locationId validation
  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
  }

  // Updated prefix to remove locationId
  const prefix = `events/${eventId}/`;

  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: prefix,
  });

  try {
    const listData = await s3.send(listCommand);
    const contents = listData.Contents ?? [];

    console.log(`🧮 S3: Found ${contents.length} object(s) under ${prefix}`);

    const signedUrls = await Promise.all(
      contents
        .filter(obj => obj.Size && obj.Size > 0)
        .map(async (obj) => {
          const getCommand = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: obj.Key!,
          });
          const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
          return {
            key: obj.Key,
            url: signedUrl,
          };
        })
    );

    console.log(`✅ Returning ${signedUrls.length} valid image URL(s)`);

    return NextResponse.json(signedUrls);
  } catch (err) {
    console.error('❌ S3 list-images error:', err);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}