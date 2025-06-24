'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {QRCodeSVG} from 'qrcode.react';

export default function EventQRPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📦 Load event details and locations
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

  if (loading || !event) return <p className="p-6">Loading event and QR codes...</p>;

  const handleBack = () => router.push('/dashboard');

  return (
    <main className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{event.Name}</h1>
        <p><strong>Start Date:</strong> {new Date(event.StartDate).toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {new Date(event.EndDate).toLocaleDateString()}</p>
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

      <button
        onClick={handleBack}
        className="mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </main>
  );
}
