import { z } from 'zod';

export const createGalleryImageSchema = z.object({
  barberShopID: z.number().int().positive(),
  filePath: z.string().min(1),
  altText: z.string().min(1),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().nullable(),
});

export const updateGalleryImageSchema = createGalleryImageSchema;
