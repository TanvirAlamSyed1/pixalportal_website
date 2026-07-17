'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { QRCodeSVG } from 'qrcode.react';

interface EventData {
  eventid: string;
  name: string;
  startdate: string;
  enddate: string;
  address: string;
  postcode: string;
  description?: string;
  mapurl?: string;
}

export default function EventQRPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch only the event data on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .eq('eventid', eventId)
        .single();
      
      if (error) console.error("Error fetching event:", error);
      setEvent(data);
      setLoading(false);
    };
    fetchData();
  }, [eventId]);

  const handleBack = () => router.push('/dashboard');

  if (loading || !event) return <p className="p-6">Loading event details...</p>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  // Generate the QR code URL based solely on the eventId
  const uploadUrl = `${process.env.NEXT_PUBLIC_UPLOAD_BASE_URL}/upload/${eventId}`;

  return (
    <main className="p-6 space-y-8">
      {/* Event Details Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <p><strong>Start Date:</strong> {formatDate(event.startdate)}</p>
        <p><strong>End Date:</strong> {formatDate(event.enddate)}</p>
        <p><strong>Address:</strong> {event.address}</p>
        <p><strong>Postcode:</strong> {event.postcode}</p>
        <p><strong>Description:</strong> {event.description}</p>
        {event.mapurl && (
          <div>
            <strong>Map:</strong><br />
            <a href={event.mapurl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              View Map
            </a>
          </div>
        )}
      </div>

      {/* Simplified QR Code Section */}
      <div className="p-6 border rounded shadow text-center">
        <h2 className="text-2xl font-semibold mb-4">Event QR Code</h2>
        <QRCodeSVG value={uploadUrl} size={200} />
        <p className="text-xs break-all mt-4">{uploadUrl}</p>
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