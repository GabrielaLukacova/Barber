import { z } from 'zod';

export const createTimeOffSchema = z.object({
  start: z.string().min(1), // you store as string (datetime) in DB
  end: z.string().min(1),
  reason: z.string().optional().nullable(),
});

export const updateTimeOffSchema = createTimeOffSchema;
