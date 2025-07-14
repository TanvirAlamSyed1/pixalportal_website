'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<Image[]>([]);
  const [discardedImages, setDiscardedImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) {
      handleSwipe('left');
    } else if (delta < -50) {
      handleSwipe('right');
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentImage = images[currentIndex];
    if (direction === 'right') {
      setLikedImages((prev) => [...prev, currentImage]);
    } else {
      setDiscardedImages((prev) => [...prev, currentImage]);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDelete = async (image: Image) => {
    setDeleting(image.ImageID);
    const res = await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        locationId,
        imageId: image.ImageID,
      }),
    });

    if (res.ok) {
      setDiscardedImages((prev) => prev.filter((img) => img.ImageID !== image.ImageID));
    } else {
      alert('Failed to delete image.');
    }
    setDeleting(null);
  };

  if (loading) return <p className="p-6">Loading images...</p>;

  if (currentIndex >= images.length) {
    return (
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🎉 You've gone through all images!</h1>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-green-600">✅ Liked Images</h2>
          {likedImages.length === 0 ? (
            <p className="text-gray-500">No liked images.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {likedImages.map((img) => (
                <a key={img.ImageID} href={img.PublicUrl} target="_blank" rel="noopener noreferrer">
                  <img src={img.PublicUrl} alt="Liked" className="w-full h-40 object-cover rounded" />
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-red-600">🗑️ Discarded Images</h2>
          {discardedImages.length === 0 ? (
            <p className="text-gray-500">No discarded images.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {discardedImages.map((img) => (
                <div key={img.ImageID} className="relative">
                  <img src={img.PublicUrl} alt="Discarded" className="w-full h-40 object-cover rounded" />
                  <button
                    disabled={deleting === img.ImageID}
                    onClick={() => handleDelete(img)}
                    className="absolute bottom-2 left-2 right-2 bg-red-600 text-white text-sm py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting === img.ImageID ? 'Deleting...' : 'Delete from S3'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          onClick={() => router.back()}
          className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-900 mt-4"
        >
          ← Back to Event
        </button>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📍 Swipe Images</h1>

      <div
        className="w-full h-80 bg-gray-100 flex items-center justify-center rounded overflow-hidden shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIndex].PublicUrl}
          alt="Swipe"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex justify-between mt-4 space-x-4">
        <button
          onClick={() => handleSwipe('left')}
          className="w-1/2 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          👎 Discard
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-1/2 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          👍 Keep
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        {currentIndex + 1} of {images.length}
      </p>
    </main>
  );
}
