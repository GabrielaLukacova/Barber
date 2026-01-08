import { z } from 'zod';

export const serviceBaseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name must be at most 30 characters'),
  duration: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    // cast form values
    z.number().int().positive(),
  ),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    // allow zero price
    z.number().int().nonnegative(),
  ),
  isBooked: z
    .preprocess((val) => {
      if (val === '1' || val === 'true') return true;
      if (val === '0' || val === 'false' || val === undefined) return false;
      return val;
    }, z.boolean())
    .optional(),
});

export const createServiceSchema = serviceBaseSchema.extend({
  // image optional
  imagePath: z.string().nullable().optional(),
});

export const updateServiceSchema = createServiceSchema;