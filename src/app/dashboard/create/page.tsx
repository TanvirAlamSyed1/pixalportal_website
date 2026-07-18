'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventFormSchema, EventFormValues } from './formSchema';
import { createEvent } from '@/utils/api'; // Using our clean abstraction

export default function CreateEventPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newEmail, setNewEmail] = useState(''); // State for the current email input

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            name: '',
            startDate: '',
            endDate: '',
            address: '',
            postcode: '',
            mapURL: '',
            description: '',
            priorityList: [], // Initialize as empty array
        },
    });

    // Access the current list directly from the form state
    const priorityList = watch('priorityList') || [];

    const addEmail = () => {
        if (newEmail && !priorityList.includes(newEmail)) {
            setValue('priorityList', [...priorityList, newEmail]);
            setNewEmail(''); // Reset input
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setValue('priorityList', priorityList.filter(email => email !== emailToRemove));
    };

    const onSubmit = async (data: EventFormValues) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Because your backend now uses LocalDate, we must strip the time 
            // from the datetime-local string (format: YYYY-MM-DDTHH:mm -> YYYY-MM-DD)
            const formattedData = {
                ...data,
                startDate: data.startDate ? data.startDate.split('T')[0] : null,
                endDate: data.endDate ? data.endDate.split('T')[0] : null,
            };

            // We use our clean API abstraction with the formatted dates
            await createEvent(formattedData);
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
                        <input type="datetime-local" {...register('startDate')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="datetime-local" {...register('endDate')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                    <input type="url" {...register('mapURL')} className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" placeholder="https://maps.google.com/..." />
                    {errors.mapURL && <p className="mt-1 text-sm text-red-600">{errors.mapURL.message}</p>}
                </div>

                                {/* Address Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input 
                        type="text" 
                        {...register('address')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" 
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>

                {/* Postcode Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Postcode</label>
                    <input 
                        type="text" 
                        {...register('postcode')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" 
                    />
                    {errors.postcode && <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>}
                </div>

                {/* Description Field (Textarea) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        {...register('description')} 
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" 
                        rows={4}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                {/* New Priority Users Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority Users (Emails)</label>
                    <div className="flex gap-2 mt-1">
                        <input 
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="user@example.com"
                        />
                        <button 
                            type="button" 
                            onClick={addEmail}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
                        >
                            Add
                        </button>
                    </div>
                    
                    {/* Display the list */}
                    <ul className="mt-3 space-y-2">
                        {priorityList.map((email) => (
                            <li key={email} className="flex items-center justify-between p-2 text-sm bg-gray-50 border rounded-md">
                                {email}
                                <button type="button" onClick={() => removeEmail(email)} className="text-red-500 hover:text-red-700">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700">
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
}