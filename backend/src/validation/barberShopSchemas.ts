import { z } from 'zod';

const emptyToNull = (v: unknown) => {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  return t === '' ? null : t;
};

const optStr = z.preprocess(emptyToNull, z.string().nullable().optional());

export const createBarberShopSchema = z.object({
  name: z.string().min(1),
  phoneNumber: optStr,
  email: optStr,
  street: optStr,
  postalCode: optStr,
  city: optStr,
  description: optStr,
});

export const updateBarberShopSchema = createBarberShopSchema;