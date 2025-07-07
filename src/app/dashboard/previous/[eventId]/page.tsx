'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Location = {
  LocationID: string;
  Name: string;
};

type Image = {
  ImageID: string;
  LocationID: string;
  PublicUrl: string;
};

export default function ViewImagesPage() {
  const { eventId } = useParams() as { eventId?: string };
  const [locations, setLocations] = useState<Location[]>([]);
  const [imagesByLocation, setImagesByLocation] = useState<Record<string, Image[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchImages = async () => {
      setLoading(true);

      // Fetch locations
      const { data: locationData, error: locationError } = await supabase
        .from('Location')
        .select('LocationID, Name')
        .eq('EventID', eventId);

      if (locationError) {
        console.error('Location fetch error:', locationError);
        return;
      }

      setLocations(locationData || []);

      // Fetch all images for this event
      const { data: imageData, error: imageError } = await supabase
        .from('Image')
        .select('ImageID, LocationID, PublicUrl')
        .eq('EventID', eventId);

      if (imageError) {
        console.error('Image fetch error:', imageError);
        return;
      }

      const grouped: Record<string, Image[]> = {};
      for (const image of imageData || []) {
        if (!grouped[image.LocationID]) grouped[image.LocationID] = [];
        grouped[image.LocationID].push(image);
      }

      setImagesByLocation(grouped);
      setLoading(false);
    };

    fetchImages();
  }, [eventId]);

  if (loading) return <p className="p-6">Loading images...</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📸 Images by Location</h1>

      {locations.length === 0 && <p>No locations found for this event.</p>}

      {locations.map((loc) => (
        <div key={loc.LocationID}>
          <h2 className="text-lg font-semibold mb-2">{loc.Name}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(imagesByLocation[loc.LocationID] || []).map((img) => (
              <a key={img.ImageID} href={img.PublicUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={img.PublicUrl}
                  alt="Uploaded"
                  className="w-full h-40 object-cover rounded border"
                />
              </a>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
