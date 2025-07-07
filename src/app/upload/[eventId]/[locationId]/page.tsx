'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UploadPage() {
  const { eventId, locationId } = useParams() as {
    eventId?: string;
    locationId?: string;
  };

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔐 Validate that the location belongs to the event
  useEffect(() => {
    const verifyLocation = async () => {
      if (!eventId || !locationId) {
        setIsValid(false);
        return;
      }

      const { data, error } = await supabase
        .from('EventLocation')
        .select('EventLocID')
        .eq('EventLocID', locationId)
        .eq('EventID', eventId)
        .maybeSingle();

      setIsValid(!!data && !error);
    };

    verifyLocation();
  }, [eventId, locationId]);

  console.log(eventId)
  console.log(locationId)

  const handleFilesAdded = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validImages = Array.from(newFiles).filter((file) =>
      file.type.startsWith('image/')
    );

    const newPreviews = validImages.map((file) =>
      URL.createObjectURL(file)
    );

    setFiles((prev) => [...prev, ...validImages]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (!files.length || !eventId || !locationId) return;

    setIsUploading(true);
    setUploadStatus([]);
    const newStatus: string[] = [];

    for (const file of files) {
      try {
        console.log('Before Post Request:', { eventId, locationId })
        const res = await fetch('/api/s3-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId,
            locationId,
            fileName: file.name,
            contentType: file.type,
          }),
        });

        if (!res.ok) throw new Error(`Failed to get URL for ${file.name}`);
        const { uploadUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error(`Upload failed for ${file.name}`);

        newStatus.push(`✅ ${file.name} uploaded successfully.`);
      } catch (err: any) {
        newStatus.push(`❌ ${file.name} failed: ${err.message}`);
      }
    }

    setUploadStatus(newStatus);
    setFiles([]);
    setPreviews([]);
    setIsUploading(false);
  };

  // 🚫 Invalid Event/Location
  if (isValid === false) {
    return (
      <main className="p-6 text-center text-red-600">
        <h1 className="text-xl font-bold">🚫 Invalid Event or Location</h1>
        <p>Please check the URL. This location does not belong to the event.</p>
      </main>
    );
  }

  // ⏳ Waiting for validation
  if (isValid === null) {
    return (
      <main className="p-6 text-center text-gray-600">
        <p>Validating location...</p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">📤 Upload Images to Location</h1>

      <div className="mb-4 text-sm text-gray-600">
        <p><strong>Event ID:</strong> <code>{eventId || '—'}</code></p>
        <p><strong>Location ID:</strong> <code>{locationId || '—'}</code></p>
      </div>

      {/* Drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 text-center transition cursor-pointer ${
          isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-400'
        }`}
      >
        <p className="text-gray-600">
          Drag and drop image files here or{' '}
          <span className="underline text-blue-600">click to browse</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />
      </div>

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="mt-4 text-sm text-gray-700">
          <p><strong>Selected Files:</strong></p>
          <ul className="mt-2 space-y-1">
            {files.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded text-sm"
              >
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => {
                    setFiles((prev) => prev.filter((_, index) => index !== i));
                    setPreviews((prev) => prev.filter((_, index) => index !== i));
                  }}
                  className="ml-3 text-red-500 hover:text-red-700 text-xs"
                  title="Remove"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Preview ${i}`}
              className="w-full h-40 object-cover rounded border"
            />
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!files.length || isUploading}
        className={`w-full mt-6 py-2 px-4 rounded text-white transition ${
          !files.length || isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
      </button>

      {/* Upload status */}
      <div className="mt-6 space-y-2">
        {uploadStatus.map((msg, i) => (
          <p key={i} className={msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>
            {msg}
          </p>
        ))}
      </div>
    </main>
  );
}
