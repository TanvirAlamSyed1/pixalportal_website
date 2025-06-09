'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CompleteFormPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('User')
        .select('First_Name, Surname')
        .eq('User_ID', user.id)
        .maybeSingle();

      if (profile) {
        setFirstName(profile.First_Name || '');
        setSurname(profile.Surname || '');
      }

      setLoading(false);
    };

    loadProfile();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('User')
      .update({ First_Name: firstName, Surname: surname })
      .eq('User_ID', user.id);

    if (!error) {
      // Optional: Optimistic local update
      setFirstName(firstName); 
      setSurname(surname);

      // ✅ Give Supabase a moment to commit the update before middleware re-runs
      await new Promise((r) => setTimeout(r, 500));

      router.push('/dashboard');
    } else {
      console.error('❌ Error updating profile:', error);
      setLoading(false);
    }
  };
  if (loading) return <div className="p-4 text-white">Loading...</div>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Surname</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {loading ? 'Saving...' : 'Save and Continue'}
        </button>

      </form>
    </main>
  );
}
