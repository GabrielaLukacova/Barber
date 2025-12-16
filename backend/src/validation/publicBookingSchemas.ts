import { z } from 'zod';

export const availableSlotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  serviceIDs: z
    .string()
    .min(1, 'serviceIDs is required')
    .transform((s) =>
      s
        .split(',')
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n) && n > 0),
    )
    .refine((arr) => arr.length > 0, 'serviceIDs must contain at least one valid id'),
});

export const publicBookSchema = z.object({
  barberShopID: z.number().int().positive(),
  serviceIDs: z.array(z.number().int().positive()).min(1, 'Select at least one service'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:MM'),
  customerName: z.string().min(2, 'Name is required').max(80, 'Name is too long'),
  customerEmail: z
    .string()
    .email('Email is invalid')
    .max(120, 'Email is too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  customerPhone: z
    .string()
    .min(5, 'Phone is too short')
    .max(30, 'Phone is too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});
