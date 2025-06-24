'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function UploadPage() {
  const { eventId, locationId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    // Ask server to get a signed S3 upload URL
    const res = await fetch('/api/s3-upload-url', {
      method: 'POST',
      body: JSON.stringify({ eventId, locationId, fileName: file.name }),
      headers: { 'Content-Type': 'application/json' },
    });

    const { uploadUrl, publicUrl } = await res.json();

    // PUT the file to S3
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
    });

    if (uploadRes.ok) {
      setMessage('✅ Uploaded successfully!');
    } else {
      setMessage('❌ Upload failed.');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload for Location</h1>
      <p className="mb-2 text-sm text-gray-600">
        Event ID: <code>{eventId}</code><br />
        Location ID: <code>{locationId}</code>
      </p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
