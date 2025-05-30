'use client';

import Link from 'next/link';
import React from 'react';

// Reusable Event Card
const EventCard = ({ title }: { title: string }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg w-40 h-40 flex items-center justify-center shadow hover:shadow-lg">
    <span className="text-center">{title}</span>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="flex h-screen text-black">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to your dashboard</h1>
        <p className="text-sm text-gray-300 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* Current Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Current Events</h2>
          <div className="flex gap-4">
            <EventCard title="Mendi" />
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="flex gap-4 flex-wrap">
            <EventCard title="Wedding" />
            <EventCard title="Walima" />
          </div>
        </section>

        {/* Previous Events */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Previous Events</h2>
          <div className="flex gap-4">
            <EventCard title="Agadir Trip" />
          </div>
        </section>
      </main>
    </div>
  );
}


