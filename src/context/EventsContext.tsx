'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Event {
  EventID: string;
  Name: string;
  StartDate?: string;
  EndDate?: string;
}

const EventsContext = createContext<{
  events: Event[];
  loading: boolean;
  refetch: () => void;
}>({
  events: [],
  loading: true,
  refetch: () => {},
});

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setLoading(false);

    const { data, error } = await supabase
      .from('Event')
      .select('EventID, Name, StartDate, EndDate')
      .eq('CreatedByUserID', user.id);

    if (!error) setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventsContext.Provider value={{ events, loading, refetch: fetchEvents }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
