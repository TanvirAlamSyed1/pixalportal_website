'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) 
{
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile dropdown
  const router = useRouter();
  const supabase = createClientComponentClient();


  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.push('/login');
  };


  return (
    <>
      {/* 🔹 MOBILE TOPBAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-50">
        <h2 className="text-lg font-bold">Menu</h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 🔹 MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-gray-900 text-white z-40 shadow-lg">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            <Link href="/dashboard" className="hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/dashboard/create" className="hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Create Event</Link>
            <Link href="/dashboard/current" className="hover:bg-gray-700 px-4 py-2 rounded"onClick={() => setMobileMenuOpen(false)}>Current Event</Link>
            <Link href="/dashboard/manage" className="hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Manage Events</Link>
            <Link href="/dashboard/previous" className="hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Previous Events</Link>
            <Link href="/dashboard/settings" className="hover:bg-gray-700 px-4 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700 w-full py-2 rounded text-white"
            >
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* 🔹 DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex fixed top-0 left-0 h-full bg-gray-900 text-white z-30 shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
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
                  <Link href="/dashboard/current" className="hover:bg-gray-700 px-4 py-2 rounded">Current Events</Link>
                  <Link href="/dashboard/manage" className="hover:bg-gray-700 px-4 py-2 rounded">Manage Events</Link>
                  <Link href="/dashboard/previous" className="hover:bg-gray-700 px-4 py-2 rounded">Previous Events</Link>
                  <Link href="/dashboard/settings" className="hover:bg-gray-700 px-4 py-2 rounded">Settings</Link>
                </nav>
              </>
            )}
          </div>

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
    </>
  );
}
