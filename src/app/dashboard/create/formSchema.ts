// src/app/dashboard/create/formSchema.ts
import * as z from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(2, { message: 'Event name must be at least 2 characters.' }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  address: z.string().optional(),
  postcode: z.string().optional(),
  mapURL: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')), // Updated
  description: z.string().optional(),
  priorityList: z.array(z.string().email()).optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;