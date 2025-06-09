'use client';

import { useState } from 'react';
import Sidebar from './components/dashboardSidebar';
import { EventsProvider } from '@/context/EventsContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true); // shared sidebar state

  return (
    <EventsProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main
          className={`
            flex-1 p-5 
            pt-20 md:pt-6 
            transition-all duration-300 
            ${isOpen ? 'md:ml-64' : 'md:ml-16'}
          `}
        >
          {children}
        </main>
      </div>
    </EventsProvider>
  );
}
