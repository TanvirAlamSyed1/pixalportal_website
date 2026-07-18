'use client';

import { useEffect } from 'react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEvents } from '@/context/EventsContext';
import { Event as EventType } from '@/types/events';

type EventWithHref = EventType & { customHref?: string };

const EventCard = ({ title, href, countdown }: { title: string; href: string; countdown?: string }) => (
  <Link
    href={href}
    className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex flex-col items-center justify-center shadow hover:shadow-lg text-center"
  >
    <span className="font-semibold">{title}</span>
    {countdown && <span className="text-sm text-gray-300 mt-2">{countdown}</span>}
  </Link>
);

const EventSection = ({ title, events, showCountdown = false, sort = false }: { title: string; events: EventWithHref[]; showCountdown?: boolean; sort?: boolean; }) => {
  const now = dayjs();

  // Sort events based on the ISO date strings
  const sortedEvents = sort
    ? [...events].sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)))
    : events;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 flex-wrap">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(e => {
            const start = dayjs(e.startDate);
            const countdown = showCountdown && e.startDate
              ? `${start.diff(now, 'day')} day${start.diff(now, 'day') !== 1 ? 's' : ''} to go`
              : undefined;

            const link = e.customHref || `/dashboard/view/${e.eventId}`;
            return <EventCard key={`${e.eventId}-${title}`} title={e.name} href={link} countdown={countdown} />;
          })
        ) : (
          <p>No {title.toLowerCase()}</p>
        )}
      </div>
    </section>
  );
};

export default function DashboardPage() {
  const { events, loading, refetch } = useEvents(); 
  const now = dayjs();

  useEffect(() => {
    if (refetch) refetch();
  }, [refetch]);

  const validEvents = events.filter(e => e.eventId);

  // Filter events based on simple ISO date strings
  const currentEvents: EventWithHref[] = validEvents
    .filter(e => {
      if (!e.startDate) return false;
      const start = dayjs(e.startDate).startOf('day');
      const end = e.endDate ? dayjs(e.endDate).endOf('day') : start.endOf('day');
      const today = now.startOf('day');
      return (start.isSame(today) || start.isBefore(today)) && (end.isSame(today) || end.isAfter(today));
    })
    .map(e => ({ ...e, customHref: `/dashboard/current/${e.eventId}` }));

  const upcomingEvents = validEvents
    .filter(e => {
      if (!e.startDate) return false;
      const start = dayjs(e.startDate).startOf('day');
      const today = now.startOf('day');
      return start.isAfter(today);
    });

  const previousEvents = validEvents
    .filter(e => {
      if (!e.startDate && !e.endDate) return false;
      const end = e.endDate ? dayjs(e.endDate).endOf('day') : dayjs(e.startDate).endOf('day');
      const today = now.startOf('day');
      return end.isBefore(today);
    })
    .map(e => ({ ...e, customHref: `/dashboard/previous/${e.eventId}` }));

  return (
    <div className="flex h-screen text-black">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          View your current, upcoming and previous events below.
        </p>

        {loading ? <p>Loading events...</p> : (
          <>
            <EventSection title="Current Events" events={currentEvents} />
            <EventSection title="Upcoming Events" events={upcomingEvents} showCountdown sort />
            <EventSection title="Previous Events" events={previousEvents} />
          </>
        )}
      </main>
    </div>
  );
}