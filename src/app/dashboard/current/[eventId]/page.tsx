'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';

interface EventData {
  EventID: string;
  Name: string;
  StartDate: string;
  EndDate: string;
  Address: string;
  Postcode: string;
  Description?: string;
  MapURL?: string;
}

interface LocationData {
  EventLocID: string;
  Name: string;
}

export default function EventQRPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch event and locations on mount
  useEffect(() => {
    const fetchData = async () => {
      const [{ data: eventData }, { data: locationData }] = await Promise.all([
        supabase.from('Event').select('*').eq('EventID', eventId).single(),
        supabase.from('EventLocation').select('EventLocID, Name').eq('EventID', eventId),
      ]);
      setEvent(eventData);
      setLocations(locationData || []);
      setLoading(false);
    };
    fetchData();
  }, [eventId]);

  const handleBack = () => router.push('/dashboard');

  const handleAddLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString().trim() || '';

    if (!name) {
      alert('Location name is required.');
      setSubmitting(false);
      return;
    }

    // Step 1: Insert into Supabase
    const { data: insertedLoc, error } = await supabase
      .from('EventLocation')
      .insert({ EventID: eventId, Name: name, Description: description })
      .select('EventLocID')
      .single();

    if (error || !insertedLoc) {
      alert('Error adding location: ' + error?.message);
      setSubmitting(false);
      return;
    }

    // Step 2: Trigger S3 folder creation
    const res = await fetch('/api/create-event-folder-single', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, locationId: insertedLoc.EventLocID }),
    });

    if (!res.ok) {
      alert('Folder creation failed in S3.');
      setSubmitting(false);
      return;
    }

    // Step 3: Refresh location list
    const { data: updatedLocations } = await supabase
      .from('EventLocation')
      .select('EventLocID, Name')
      .eq('EventID', eventId);

    setLocations(updatedLocations || []);
    form.reset(); // ✅ Safe and readable
    setSubmitting(false);
  };


  if (loading || !event) return <p className="p-6">Loading event and QR codes...</p>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const renderEventDetails = () => (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">{event.Name}</h1>
      <p><strong>Start Date:</strong> {formatDate(event.StartDate)}</p>
      <p><strong>End Date:</strong> {formatDate(event.EndDate)}</p>
      <p><strong>Address:</strong> {event.Address}</p>
      <p><strong>Postcode:</strong> {event.Postcode}</p>
      <p><strong>Description:</strong> {event.Description}</p>
      {event.MapURL && (
        <div>
          <strong>Map:</strong><br />
          <a href={event.MapURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View Map
          </a>
        </div>
      )}
    </div>
  );

  const renderQRCodeGrid = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Upload QR Codes</h2>
      <p className="text-sm text-gray-600">
        Scan a QR code to upload images for each location.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations.map(loc => {
          const uploadUrl = `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/upload/${eventId}/${loc.EventLocID}`;
          return (
            <div key={loc.EventLocID} className="p-4 border rounded shadow text-center">
              <h3 className="font-semibold mb-2">{loc.Name}</h3>
              <QRCodeSVG value={uploadUrl} size={160} />
              <p className="text-xs break-all mt-2">{uploadUrl}</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAddLocationForm = () => (
    <div className="mt-10 space-y-4 border-t pt-6">
      <h2 className="text-xl font-semibold">Add New Location</h2>
      <form onSubmit={handleAddLocation} className="space-y-3">
        <input
          name="name"
          placeholder="Location Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {submitting ? 'Adding...' : 'Add Location'}
        </button>
      </form>
    </div>
  );

  return (
    <main className="p-6 space-y-8">
      {renderEventDetails()}
      {renderQRCodeGrid()}
      {renderAddLocationForm()}
      <button
        onClick={handleBack}
        className="mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </main>
  );
}
