'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'loggedIn=; Max-Age=0; path=/';
    router.push('/login');
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-30 shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex flex-col justify-between h-full pt-6 px-4 pb-6">
        <div>
          <button
            className="mb-6 bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
          </button>

          {isOpen && (
            <>
              <h2 className="text-xl font-bold mb-4">Menu</h2>
              <nav className="flex flex-col space-y-2">
                <Link href="/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded">Home</Link>
                <Link href="/dashboard/create" className="hover:bg-gray-700 px-4 py-2 rounded">Create Event</Link>
                <Link href="/dashboard/manage" className="hover:bg-gray-700 px-4 py-2 rounded">Manage Events</Link>
                <Link href="/dashboard/previous" className="hover:bg-gray-700 px-4 py-2 rounded">Previous Events</Link>
              </nav>
            </>
          )}
        </div>

        {/* Logout button at the bottom */}
        {isOpen && (
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-600 hover:bg-red-700 w-full py-2 rounded text-white"
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
