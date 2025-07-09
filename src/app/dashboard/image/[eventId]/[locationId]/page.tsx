'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Image = {
  ImageID: string;
  PublicUrl: string;
};

export default function LocationImagesPage() {
  const { eventId, locationId } = useParams() as {
    eventId?: string;
    locationId?: string;
  };

  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      if (!eventId || !locationId) return;

      const res = await fetch(`/api/list-images?eventId=${eventId}&locationId=${locationId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const parsed = data.map((item: any) => ({
          ImageID: item.key.split('/').pop(),
          PublicUrl: item.url,
        }));
        setImages(parsed);
      }

      setLoading(false);
    };

    fetchImages();
  }, [eventId, locationId]);

  if (loading) return <p className="p-6">Loading images...</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📍 Location Images</h1>

      {images.length === 0 && <p>No images found for this location.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <a key={img.ImageID} href={img.PublicUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={img.PublicUrl}
              alt="Uploaded"
              className="w-full h-40 object-cover rounded border"
            />
          </a>
        ))}
      </div>
      <button
        onClick={() => router.back()}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
        ← Back to Event
        </button>

    </main>
  );
}
