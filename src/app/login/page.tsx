'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();


  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-black mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded text-black"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded text-black"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <Link
            href="/login/signup"
            className="block text-center mt-4 text-blue-600 hover:underline"
          >
            Create Account
          </Link>
        </form>
      </div>
    </main>
  );
}
