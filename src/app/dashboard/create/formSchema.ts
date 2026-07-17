import * as z from 'zod';

export const eventFormSchema = z.object({
  name: z.string().min(2, { message: 'Event name must be at least 2 characters.' }),
  startdate: z.string().min(1, { message: 'Start date is required.' }), // Changed from startDate
  enddate: z.string().min(1, { message: 'End date is required.' }),     // Changed from endDate
  address: z.string().optional(),
  postcode: z.string().optional(),
  mapurl: z.string().url({ message: 'Must be a valid URL.' }).optional().or(z.literal('')), // Changed from mapUrl
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
