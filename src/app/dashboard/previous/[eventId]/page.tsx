'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

type Location = {
  EventLocID: string;
  Name: string;
};

export default function EventLocationsPage() {
  const { eventId } = useParams() as { eventId?: string };
  const router = useRouter();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!eventId) return;

      const { data, error } = await supabase
        .from('EventLocation')
        .select('EventLocID, Name')
        .eq('EventID', eventId);

      if (error) {
        console.error('Failed to fetch locations:', error);
        return;
      }

      setLocations(data ?? []);
      setLoading(false);
    };

    fetchLocations();
  }, [eventId]);

  if (loading) return <p className="p-6">Loading locations...</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📁 Locations in This Event</h1>

      <button
        onClick={() => router.push('/dashboard/previous')}
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        ← Back to Previous Events
      </button>

      {locations.length === 0 ? (
        <p className="text-gray-500">No locations found for this event.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {locations.map((loc) => (
            <Link
              key={loc.EventLocID}
              href={`/dashboard/image/${eventId}/${loc.EventLocID}`}
              className="bg-gray-800 text-white p-4 rounded-lg h-40 flex items-center justify-center text-center shadow hover:shadow-lg"
            >
              {loc.Name}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
