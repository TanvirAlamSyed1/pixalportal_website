'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EditLocationPage() {
  const { locationId } = useParams() as { locationId: string };
  const router = useRouter();

  const [form, setForm] = useState({
    Name: '',
    Description: ''
  });

  useEffect(() => {
    const fetchLocation = async () => {
      const { data, error } = await supabase
        .from('EventLocation')
        .select('Name, Description')
        .eq('EventLocID', locationId)
        .single();

      if (!error && data) setForm(data);
    };

    fetchLocation();
  }, [locationId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase
      .from('EventLocation')
      .update(form)
      .eq('EventLocID', locationId);

    router.back(); // or router.push(...) to a specific page
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="Name"
          value={form.Name}
          onChange={handleChange}
          placeholder="Location Name"
          className="w-full border p-2"
        />
        <textarea
          name="Description"
          value={form.Description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </main>
  );
}
