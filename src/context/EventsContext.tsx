'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchFromBackend } from '@/utils/api';
import { Event } from '@/types/events';

interface EventsContextProps {
    events: Event[];
    loading: boolean;
    error: string | null;
    refreshEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextProps | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch events from the Spring Boot API
            const data = await fetchFromBackend('/events');
            setEvents(data);
        } catch (err: any) {
            console.error('Failed to fetch events from backend:', err);
            setError(err.message || 'Failed to load events.');
        } finally {
            setIsLoading(false);
        }
    };

    // Load events automatically when the provider mounts
    useEffect(() => {
        refreshEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ events, loading, error, refreshEvents }}>
            {children}
        </EventsContext.Provider>
    );
};

// Custom hook for easy access to the context
export const useEvents = () => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};