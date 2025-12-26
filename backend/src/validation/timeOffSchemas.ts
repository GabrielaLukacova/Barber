import { z } from 'zod';

const iso = z.string().datetime({ offset: true }).or(z.string().datetime());

export const createTimeOffSchema = z
  .object({
    start: iso,
    end: iso,
    reason: z.string().trim().max(500).optional().nullable(),
  })
  .refine((d) => new Date(d.end).getTime() > new Date(d.start).getTime(), {
    message: 'End must be after start',
    path: ['end'],
  });

export const updateTimeOffSchema = createTimeOffSchema.partial().refine(
  (d) => {
    if (!d.start || !d.end) return true;
    return new Date(d.end).getTime() > new Date(d.start).getTime();
  },
  { message: 'End must be after start', path: ['end'] },
);
