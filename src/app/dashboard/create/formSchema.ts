// src/app/dashboard/create/formSchema.ts
import * as z from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(2, { message: 'Event name must be at least 2 characters.' }),
  startDate: z.string().min(1, { message: 'Start date is required.' }), // Updated
  endDate: z.string().min(1, { message: 'End date is required.' }),     // Updated
  address: z.string().optional(),
  postcode: z.string().optional(),
  mapURL: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')), // Updated
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;