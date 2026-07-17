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
            startdate: '', // Updated
            enddate: '',   // Updated
            address: '',
            postcode: '',
            mapurl: '',    // Updated
            description: '',
        },
    });

    const onSubmit = async (data: EventFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const savedEvent = await fetchFromBackend('/events', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            console.log('Event created successfully:', savedEvent);
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
                    <input type="text" {...register('name')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="datetime-local" {...register('startdate')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        {errors.startdate && <p className="mt-1 text-sm text-red-600">{errors.startdate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="datetime-local" {...register('enddate')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        {errors.enddate && <p className="mt-1 text-sm text-red-600">{errors.enddate.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                    <input type="url" {...register('mapurl')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder="https://maps.google.com/..." />
                    {errors.mapurl && <p className="mt-1 text-sm text-red-600">{errors.mapurl.message}</p>}
                </div>

                {/* ... keep address, postcode, and description fields similarly updated with lowercase register names ... */}
                
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}