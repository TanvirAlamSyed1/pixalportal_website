'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dayjs from 'dayjs';
import Link from 'next/link';

interface Event {
  EventID: string;
  Name: string;
  StartDate: string;
  EndDate: string;
}

const EventCard = ({ title, href }: { title: string; href: string }) => (
  <Link href={href} className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex items-center justify-center shadow hover:shadow-lg">
    <span className="text-center">{title}</span>
  </Link>
);
export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        setLoading(false);
        return;
      }

      const userId = userData?.user?.id;
      console.log("🔑 Logged in user ID:", userId);

      if (!userId) {
        setLoading(false);
        return;
      }
      console.log("🧪 DEBUG check: useEffect is running");

      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .eq('CreatedByUserID', userId)
        .order('StartDate', { ascending: true });

      // ✅ Log BOTH result and error, always

      if (data) {
        setEvents(data as Event[]);
        console.log("📦 Raw event data from Supabase:", data);
      }
      if (error){
        console.log(error)
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const now = dayjs();

  const currentEvents = events.filter(e =>
    dayjs(e.StartDate).isSame(now) && dayjs(e.EndDate).isAfter(now)
  );
  console.log("📅 Current events:", currentEvents);
  const upcomingEvents = events.filter(e =>
    dayjs(e.StartDate).isAfter(now)
  );
  console.log("🔜 Upcoming events:", upcomingEvents);
  const previousEvents = events.filter(e =>
    dayjs(e.EndDate).isBefore(now)
  );
  console.log("📁 Previous events:", previousEvents);
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
                  ))) : (
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
                  ))) : (
                  <p>No upcoming events</p>
                )}
              </div>
            </section>
            {/* Previous Events */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Previous Events</h2>
              <div className="flex gap-4 flex-wrap">
                {previousEvents.length > 0 ? ( previousEvents.map(e => (
                    <EventCard key={e.EventID} title={e.Name} href={`/dashboard/view/${e.EventID}`} />
                  ))) : (
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
