import { z } from 'zod';

export const createPostalCodeSchema = z.object({
  postalCode: z.string().min(1),
  city: z.string().min(1),
});

export const updatePostalCodeSchema = z.object({
  city: z.string().min(1),
});