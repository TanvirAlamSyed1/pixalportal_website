'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="pt-20 px-6 space-y-4"> {/* Add top padding to avoid toggle overlap */}
          <h2 className="text-2xl font-bold">Menu</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/admin" className="hover:bg-gray-700 px-4 py-2 rounded">Home</Link>
            <Link href="/admin/create" className="hover:bg-gray-700 px-4 py-2 rounded">Create Event</Link>
            <Link href="/admin/manage" className="hover:bg-gray-700 px-4 py-2 rounded">Manage Events</Link>
            <Link href="/admin/previous" className="hover:bg-gray-700 px-4 py-2 rounded">Previous Events</Link>
          </nav>
        </div>
      </aside>

      {/* Toggle Button (always fixed in top-left) */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>
      <main className={`flex-1 transition-all duration-300 p-10 ${isOpen ? 'ml-64' : 'ml-0'}`}>
      </main>
    </div>
  );
}
