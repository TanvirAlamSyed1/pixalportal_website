import { z } from 'zod';

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().min(1, 'Postcode is required'),
  mapURL: z.string().optional(),
  description: z.string().optional(),
  locations: z.array(
    z.object({
      name: z.string().min(1, 'Location name is required'),
      description: z.string().optional(),
    })
  )
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
