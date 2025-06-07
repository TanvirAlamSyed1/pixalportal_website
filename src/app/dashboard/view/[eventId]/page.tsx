'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ViewEventPage() {
  const { eventId } = useParams() as { eventId: string };
  const [event, setEvent] = useState<any>(null);
  const router = useRouter();
  const handleLogout = async () => {
    router.push('/dashboard')
  }

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .eq('EventID', eventId)
        .single();

      if (!error && data) setEvent(data);
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <p className="p-6">Loading event details...</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{event.Name}</h1>
      <div className="space-y-2 text-gray-800">
        <p><strong>Start Date:</strong> {new Date(event.StartDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(event.EndDate).toLocaleDateString()}</p>
        <p><strong>Address:</strong> {event.Address}</p>
        <p><strong>Postcode:</strong> {event.Postcode}</p>
        <p><strong>Description:</strong> {event.Description}</p>
        {event.MapURL && (
          <div>
            <strong>Map:</strong><br />
            <a href={event.MapURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Map
            </a>
          </div>
        )}
        <button
              onClick={handleLogout}
              className="mt-auto bg-red-600 hover:bg-red-700 w-2xs py-2 rounded text-white"
            >
              Back
            </button>
      </div>
    </main>
  );
}
