'use client';

import { useEvents } from '@/context/EventsContext';
import dayjs from 'dayjs';
import Link from 'next/link';

const EventCard = ({ title, href }: { title: string; href: string }) => (
  <Link
    href={href}
    className="bg-green-700 text-white p-4 rounded-lg w-40 h-40 flex items-center justify-center shadow hover:shadow-lg"
  >
    <span className="text-center">{title}</span>
  </Link>
);

export default function CurrentEventsPage() {
  const { events, loading } = useEvents();
  const now = dayjs();

  const currentEvents = events.filter(
    e => dayjs(e.StartDate).isSame(now, 'day') && dayjs(e.EndDate).isAfter(now)
  );

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Current Events</h1>
      <p className="text-sm text-gray-500 mb-6">
        These events are currently ongoing.
      </p>

      {loading ? (
        <p>Loading events...</p>
      ) : currentEvents.length === 0 ? (
        <p>No current events available.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {currentEvents.map(event => (
            <EventCard
              key={event.EventID}
              title={event.Name}
              href={`/dashboard/current/${event.EventID}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
