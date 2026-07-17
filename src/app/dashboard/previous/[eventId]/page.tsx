'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// Updated interface to match your Event-only structure
interface EventData {
  eventid: string;
  name: string;
}

export default function EventDetailsPage() {
  const { eventId } = useParams() as { eventId?: string };
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      // Fetch only the event name/details
      const { data, error } = await supabase
        .from('Event')
        .select('eventid, name')
        .eq('eventid', eventId)
        .single();

      if (error) {
        console.error('Failed to fetch event:', error);
        return;
      }

      setEvent(data);
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p className="p-6">Loading event...</p>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📁 {event?.name || 'Event'}</h1>

      <button
        onClick={() => router.push('/dashboard/previous')}
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        ← Back to Previous Events
      </button>

      {/* Direct link to the image gallery for this event */}
      <div className="mt-6">
        <Link
          href={`/dashboard/image/${eventId}`}
          className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-xs flex items-center justify-center text-center shadow hover:shadow-lg transition"
        >
          View Event Images
        </Link>
      </div>
    </main>
  );
}