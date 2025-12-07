import { z } from 'zod';

export const createOpeningHoursSchema = z.object({
  dayOfWeek: z.string().min(1).max(10),
  openingTime: z.string().optional().nullable(), // "09:00:00" or null
  closingTime: z.string().optional().nullable(),
});

export const updateOpeningHoursSchema = createOpeningHoursSchema;
