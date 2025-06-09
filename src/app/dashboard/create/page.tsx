'use client';

import { useForm,  useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventSchema , CreateEventFormValues } from './formSchema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreateEventPage() {
  const router = useRouter();
  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      locations: [{ name: '', description: '' }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'locations',
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: CreateEventFormValues) => {
    setSubmitting(true);

    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    if (!userId) {
      alert('User not authenticated');
      setSubmitting(false);
      return;
    }

    // Step 1: Insert Event
    const { data: eventInsertData, error: eventError } = await supabase
      .from('Event')
      .insert({
        CreatedByUserID: userId,
        Name: data.name,
        StartDate: data.startDate,
        EndDate: data.endDate,
        Address: data.address,
        Postcode: data.postcode,
        MapURL: data.mapURL,
        Description: data.description
      })
      .select('EventID') // return the inserted event ID
      .single();

    if (eventError || !eventInsertData) {
      alert('Error creating event: ' + eventError?.message);
      setSubmitting(false);
      return;
    }

    const eventId = eventInsertData.EventID;

    // Step 2: Insert Locations
    const locationsToInsert = data.locations.map((loc) => ({
      EventID: eventId,
      Name: loc.name,
      Description: loc.description,
    }));

    if (locationsToInsert.length > 0) {
      const { error: locationError } = await supabase
        .from('EventLocation')
        .insert(locationsToInsert);

      if (locationError) {
        alert('Event created, but error adding locations: ' + locationError.message);
      }
    }

    setSubmitting(false);
    router.push('/dashboard');
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Event Name" className="w-full p-2 border rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register("startDate")} type="datetime-local" className="w-full p-2 border rounded" />
        {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}

        <input {...register("endDate")} type="datetime-local" className="w-full p-2 border rounded" />
        {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}

        <input {...register("address")} placeholder="Address" className="w-full p-2 border rounded" />
        <input {...register("postcode")} placeholder="Postcode" className="w-full p-2 border rounded" />
        <input {...register("mapURL")} placeholder="Map URL" className="w-full p-2 border rounded" />
        <textarea {...register("description")} placeholder="Description" className="w-full p-2 border rounded" />
        <div>
          <h2 className="text-xl font-semibold">Event Locations</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-3 rounded mt-3">
              <input {...register(`locations.${index}.name`)} placeholder="Location Name" className="w-full p-2 border rounded mb-2" />
              {errors.locations?.[index]?.name && <p className="text-red-500">{errors.locations[index]?.name?.message}</p>}

              <textarea {...register(`locations.${index}.description`)} placeholder="Location Description" className="w-full p-2 border rounded" />

              <button type="button" onClick={() => remove(index)} className="text-red-600 mt-1 text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => append({ name: '', description: '' })} className="text-blue-600 text-sm mt-2">
            + Add Location
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </main>
  );
}
