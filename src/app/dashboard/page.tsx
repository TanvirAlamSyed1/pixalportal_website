'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useEvents, Event as EventType } from '@/context/EventsContext';


const EventCard = ({
  title,
  href,
  countdown,
}: {
  title: string;
  href: string;
  countdown?: string;
}) => (
  <Link
    href={href}
    className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex flex-col items-center justify-center shadow hover:shadow-lg text-center"
  >
    <span className="font-semibold">{title}</span>
    {countdown && <span className="text-sm text-gray-300 mt-2">{countdown}</span>}
  </Link>
);

const EventSection = ({
  title,
  events,
  showCountdown = false,
  sort = false,
}: {
  title: string;
  events: EventType[];
  showCountdown?: boolean;
  sort?: boolean;
}) => {
  const now = dayjs();

  const sortedEvents = sort
    ? [...events].sort((a, b) =>
        dayjs(a.StartDate || '').diff(dayjs(b.StartDate || ''))
      )
    : events;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex gap-4 flex-wrap">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(e => {
            const countdown = showCountdown && e.StartDate
              ? `${dayjs(e.StartDate).diff(now, 'day')} day${dayjs(e.StartDate).diff(now, 'day') !== 1 ? 's' : ''} to go`
              : undefined;

            return (
              <EventCard
                key={e.EventID}
                title={e.Name}
                href={`/dashboard/view/${e.EventID}`}
                countdown={countdown}
              />
            );
          })
        ) : (
          <p>No {title.toLowerCase()}</p>
        )}
      </div>
    </section>
  );
};

export default function DashboardPage() {
  const { events, loading } = useEvents();
  const now = dayjs();

  const currentEvents = events.filter(
    e => dayjs(e.StartDate).isSame(now, 'day') && dayjs(e.EndDate).isAfter(now)
  );
  const upcomingEvents = events.filter(e => dayjs(e.StartDate).isAfter(now));
  const previousEvents = events.filter(e => dayjs(e.EndDate).isBefore(now));

  return (
    <div className="flex h-screen text-black">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          View your current, upcoming and previous events below.
        </p>

        {loading ? (
          <p>Loading events...</p>
        ) : (
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
