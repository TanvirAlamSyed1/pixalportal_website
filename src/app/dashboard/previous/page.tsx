'use client';

import { useEvents } from '@/context/EventsContext';
import dayjs from 'dayjs';
import Link from 'next/link';

const EventCard = ({ title, href }: { title: string; href: string }) => (
  <Link
    href={href}
    className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex items-center justify-center shadow hover:shadow-lg"
  >
    <span className="text-center">{title}</span>
  </Link>
);

export default function PreviousEventsPage() {
  const { events, loading } = useEvents();

  const now = dayjs();
  const previousEvents = events.filter(e => dayjs(e.EndDate).isBefore(now));

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Previous Events</h1>
      <p className="text-sm text-gray-500 mb-6">
        These are your past events that have already ended.
      </p>

      {loading ? (
        <p>Loading events...</p>
      ) : previousEvents.length === 0 ? (
        <p>You have no previous events.</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {previousEvents.map(event => (
            <EventCard
              key={event.EventID}
              title={event.Name}
              href={`/dashboard/previous/${event.EventID}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
