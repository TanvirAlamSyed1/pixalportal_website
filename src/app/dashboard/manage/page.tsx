'use client';

import Link from 'next/link';
import { useEvents } from '@/context/EventsContext';
import { supabase } from '@/lib/supabaseClient';

export default function ManagePage() {
  const { events, loading, refetch } = useEvents(); // ✅ use shared context

  const handleDelete = async (eventId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    const { error } = await supabase
      .from('Event')
      .delete()
      .eq('EventID', eventId);

    if (error) {
      alert("Failed to delete event: " + error.message);
    } else {
      // ✅ Re-fetch from context after deletion
      refetch();
    }
  };

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
              <div className="flex items-center gap-4 mt-2">
                <Link
                  href={`/dashboard/manage/${event.EventID}/edit`}
                  className="text-blue-600 underline"
                >
                  Manage Event
                </Link>
                <button
                  onClick={() => handleDelete(event.EventID)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
