'use client';

import Link from 'next/link';
import { useEvents } from '@/context/EventsContext';
import { supabase } from '@/lib/supabaseClient';

export default function ManagePage() {
  const { events, loading, refetch } = useEvents(); // ✅ use shared context

  const handleDelete = async (eventId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    // Guard clause to prevent sending an undefined ID to Supabase
    if (!eventId) {
      alert("Cannot delete event: Missing ID.");
      return;
    }

    const { error } = await supabase
      .from('Event') // Changed from 'Event' to 'event' to match the database table
      .delete()
      .eq('eventid', eventId); // Changed from 'EventID' to 'eventid' to match the database column

    if (error) {
      alert("Failed to delete event: " + error.message);
    } else {
      // ✅ Re-fetch from context after deletion
      refetch();
    }
  };

  // Filter out any events that haven't loaded their ID yet to prevent unique key warnings
  const validEvents = events.filter(e => e.eventId);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Events</h1>
      {loading ? (
        <p>Loading...</p>
      ) : validEvents.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {validEvents.map((event, index) => (
            <li key={event.eventId || `event-${index}`} className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <Link
                  href={`/dashboard/manage/${event.eventId}/edit`}
                  className="text-blue-600 underline"
                >
                  Manage Event
                </Link>
                <button
                  onClick={() => handleDelete(event.eventId)}
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