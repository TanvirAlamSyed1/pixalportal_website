'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function EditEventPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  // Updated state keys to lowercase
  const [form, setForm] = useState({
    name: '',
    startdate: '',
    enddate: '',
    address: '',
    postcode: '',
    mapurl: '',
    description: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      // Updated select query to use lowercase keys
      const { data } = await supabase
        .from('Event')
        .select('name, startdate, enddate, address, postcode, mapurl, description')
        .eq('eventid', eventId) // Updated from 'EventID'
        .single();

      if (data) setForm(data);
    };

    // Removed fetchLocations() entirely[cite: 2]
    fetchEvent();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Changed to match the actual database schema: 'Event' table and 'EventID' column
    const { error } = await supabase
      .from('Event')
      .update(form)
      .eq('EventID', eventId); // Use PascalCase to match the database column

    if (error) {
      console.error("Update error:", error);
      return;
    }

    router.push('/dashboard/manage');
  };

  // Removed handleDeleteLocation function entirely[cite: 2]

  return (
    <main className="p-6 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Updated all 'name' attributes to lowercase to match the form state[cite: 2] */}
          {/* Updated all 'value' attributes to use lowercase form properties[cite: 2] */}
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border p-2" />
          <input name="startdate" type="date" value={form.startdate?.split('T')[0] || ''} onChange={handleChange} className="w-full border p-2" />
          <input name="enddate" type="date" value={form.enddate?.split('T')[0] || ''} onChange={handleChange} className="w-full border p-2" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border p-2" />
          <input name="postcode" value={form.postcode} onChange={handleChange} placeholder="Postcode" className="w-full border p-2" />
          <input name="mapurl" value={form.mapurl} onChange={handleChange} placeholder="Map URL" className="w-full border p-2" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      </section>
      
      {/* Completely removed the 'Event Locations' section[cite: 2] */}
    </main>
  );
}