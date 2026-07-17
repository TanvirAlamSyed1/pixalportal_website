'use client';

import { useEffect, useState } from 'react';
import { fetchFromBackend } from '@/utils/api';

interface EventImage {
    key: string;
    url: string;
}

export default function ManageEventImagesPage({ params }: { params: { eventId: string } }) {
    const { eventId } = params;
    const [images, setImages] = useState<EventImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch the list of image URLs from your Spring Boot backend
                const data = await fetchFromBackend(`/list-images?eventId=${eventId}`);
                setImages(data);
            } catch (err: any) {
                console.error("Failed to load images:", err);
                setError(err.message || "Failed to load images");
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [eventId]);

    const handleDelete = async (imageKey: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await fetchFromBackend(`/delete-image`, {
                method: 'DELETE',
                body: JSON.stringify({ key: imageKey })
            });
            
            // Remove the deleted image from the local state
            setImages(images.filter(img => img.key !== imageKey));
        } catch (err: any) {
            console.error("Failed to delete image:", err);
            alert("Failed to delete image: " + err.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading images...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Manage Event Images</h1>
            
            {images.length === 0 ? (
                <p className="text-gray-500">No images have been uploaded for this event yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {images.map((image) => (
                        <div key={image.key} className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                            <img 
                                src={image.url} 
                                alt="Event Upload" 
                                className="object-cover w-full h-48"
                            />
                            <div className="p-4 bg-gray-50">
                                <button 
                                    onClick={() => handleDelete(image.key)}
                                    className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Delete Image
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}