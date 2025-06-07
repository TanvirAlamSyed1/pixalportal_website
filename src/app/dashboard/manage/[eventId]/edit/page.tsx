'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function EditEventPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  const [form, setForm] = useState({
    Name: '',
    StartDate: '',
    EndDate: '',
    Address: '',
    Postcode: '',
    MapURL: '',
    Description: ''
  });

  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase
        .from('Event')
        .select('Name, StartDate, EndDate, Address, Postcode, MapURL, Description')
        .eq('EventID', eventId)
        .single();

      if (data) setForm(data);
    };

    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('EventLocation')
        .select('EventLocID, Name, Description')
        .eq('EventID', eventId);

      if (!error) setLocations(data ?? []);
    };

    fetchEvent();
    fetchLocations();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.from('Event').update(form).eq('EventID', eventId);
    router.push('/dashboard/manage');
  };

  const handleDeleteLocation = async (locationId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this location?");
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('EventLocation')
    .delete()
    .eq('EventLocID', locationId);

  if (error) {
    alert("Failed to delete location: " + error.message);
  } else {
    // Remove deleted location from local state
    setLocations(prev => prev.filter(loc => loc.EventLocID !== locationId));
  }
};


  return (
    <main className="p-6 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="Name" value={form.Name} onChange={handleChange} placeholder="Name" className="w-full border p-2" />
          <input name="StartDate" type="date" value={form.StartDate?.split('T')[0]} onChange={handleChange} className="w-full border p-2" />
          <input name="EndDate" type="date" value={form.EndDate?.split('T')[0]} onChange={handleChange} className="w-full border p-2" />
          <input name="Address" value={form.Address} onChange={handleChange} placeholder="Address" className="w-full border p-2" />
          <input name="Postcode" value={form.Postcode} onChange={handleChange} placeholder="Postcode" className="w-full border p-2" />
          <input name="MapURL" value={form.MapURL} onChange={handleChange} placeholder="Map URL" className="w-full border p-2" />
          <textarea name="Description" value={form.Description} onChange={handleChange} placeholder="Description" className="w-full border p-2" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Event Locations</h2>
        {locations.length === 0 ? (
          <p className="text-gray-500">No locations yet for this event.</p>
        ) : (
          <ul className="space-y-2">
            {locations.map((loc) => (
              <li key={loc.EventLocID} className="border p-4 rounded shadow-sm bg-white">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{loc.Name}</h3>
                  <p className="text-sm text-gray-600">{loc.Description}</p>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link
                    href={`/dashboard/manage/locations/${loc.EventLocID}/edit`}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteLocation(loc.EventLocID)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          href={`/dashboard/manage/locations/create?eventId=${eventId}`}
          className="inline-block mt-4 text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Location
        </Link>

      </section>
    </main>
  );
}
