'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ManagePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('Event')
        .select('EventID, Name')
        .eq('CreatedByUserID', user.id);

      if (!error) setEvents(data ?? []);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.EventID} className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{event.Name}</h2>
              <Link
                href={`/dashboard/manage/${event.EventID}/edit`}
                className="text-blue-600 underline"
              >
                Manage Events
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
