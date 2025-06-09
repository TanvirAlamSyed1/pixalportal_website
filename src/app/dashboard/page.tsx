'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useEvents } from '@/context/EventsContext';

const EventCard = ({ title, href }: { title: string; href: string }) => (
  <Link
    href={href}
    className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex items-center justify-center shadow hover:shadow-lg"
  >
    <span className="text-center">{title}</span>
  </Link>
);

export default function DashboardPage() {
  const { events, loading } = useEvents(); // ✅ Use shared context

  const now = dayjs();

  const currentEvents = events.filter(e =>
    dayjs(e.StartDate).isSame(now, 'day') && dayjs(e.EndDate).isAfter(now)
  );

  const upcomingEvents = events.filter(e => dayjs(e.StartDate).isAfter(now));
  const previousEvents = events.filter(e => dayjs(e.EndDate).isBefore(now));

  return (
    <div className="flex h-screen text-black">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to your dashboard</h1>
        <p className="text-sm text-gray-500 mb-6">
          View your current, upcoming and previous events below.
        </p>

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <>
            {/* Current Events */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Current Events</h2>
              <div className="flex gap-4 flex-wrap">
                {currentEvents.length > 0 ? (
                  currentEvents.map(e => (
                    <EventCard key={e.EventID} title={e.Name} href={`/dashboard/view/${e.EventID}`} />
                  ))
                ) : (
                  <p>No current events</p>
                )}
              </div>
            </section>

            {/* Upcoming Events */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
              <div className="flex gap-4 flex-wrap">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(e => (
                    <EventCard key={e.EventID} title={e.Name} href={`/dashboard/view/${e.EventID}`} />
                  ))
                ) : (
                  <p>No upcoming events</p>
                )}
              </div>
            </section>

            {/* Previous Events */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Previous Events</h2>
              <div className="flex gap-4 flex-wrap">
                {previousEvents.length > 0 ? (
                  previousEvents.map(e => (
                    <EventCard key={e.EventID} title={e.Name} href={`/dashboard/view/${e.EventID}`} />
                  ))
                ) : (
                  <p>No previous events</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
