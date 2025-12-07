import { z } from 'zod';

export const createBarberShopSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const updateBarberShopSchema = createBarberShopSchema;
