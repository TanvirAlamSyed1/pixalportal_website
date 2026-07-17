'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, EventFormValues } from './formSchema';
import { fetchFromBackend } from '@/utils/api';

export default function CreateEventPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            name: '',
            startDate: '',
            endDate: '',
            address: '',
            postcode: '',
            mapUrl: '',
            description: '',
        },
    });

    const onSubmit = async (data: EventFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Post the flattened form data straight to Spring Boot
            const savedEvent = await fetchFromBackend('/events', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            console.log('Event created successfully:', savedEvent);
            // Redirect the user back to the dashboard upon success
            router.push('/dashboard/current');
        } catch (err: any) {
            console.error('Failed to create event:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-sm mt-10">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Create New Event</h1>
            
            {error && (
                <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Event Name</label>
                    <input 
                        type="text" 
                        {...register('name')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input 
                            type="datetime-local" 
                            {...register('startDate')} 
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                        />
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input 
                            type="datetime-local" 
                            {...register('endDate')} 
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                        />
                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input 
                        type="text" 
                        {...register('address')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Postcode</label>
                    <input 
                        type="text" 
                        {...register('postcode')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                    <input 
                        type="url" 
                        {...register('mapUrl')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                        placeholder="https://maps.google.com/..."
                    />
                    {errors.mapUrl && <p className="mt-1 text-sm text-red-600">{errors.mapUrl.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        {...register('description')} 
                        rows={4}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}