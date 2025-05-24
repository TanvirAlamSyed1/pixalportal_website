// src/app/login/page.tsx

'use client';  // 👈 This must be the very first line

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Set cookie to simulate login
    document.cookie = "loggedIn=true; path=/";

    router.push('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-black mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded text-black"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded text-black"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
