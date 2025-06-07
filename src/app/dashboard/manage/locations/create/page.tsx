'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreateLocationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [form, setForm] = useState({
    Name: '',
    Description: '',
    EventID: eventId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('EventLocation').insert([form]);

    if (error) {
      alert('Error adding location: ' + error.message);
    } else {
      router.push(`/dashboard/manage/${form.EventID}/edit`); // go back to edit event page
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="Name" onChange={handleChange} placeholder="Location Name" className="w-full border p-2" required />
        <textarea name="Description" onChange={handleChange} placeholder="Description" className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>
    </main>
  );
}
