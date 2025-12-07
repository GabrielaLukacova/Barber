import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import {
  createGalleryImageSchema,
  updateGalleryImageSchema,
} from '../validation/galleryImageSchemas';

export class GalleryImageController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.GalleryImage);
      res.json(rows);
    } catch (err) {
      console.error('GalleryImageController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid imageID' });
      }

      const [row] = await db
        .select()
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.imageID, id));

      if (!row) {
        return res.status(404).json({ error: 'Gallery image not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('GalleryImageController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createGalleryImageSchema.parse(req.body);

      const result = await db
        .insert(schema.GalleryImage)
        .values({
          barberShopID: parsed.barberShopID,
          filePath: parsed.filePath,
          altText: parsed.altText,
          title: parsed.title ?? null,
          description: parsed.description ?? null,
          sortOrder: parsed.sortOrder ?? null,
        })
        .execute();

      res.status(201).json({ success: true, result });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('GalleryImageController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid imageID' });
      }

      const parsed = updateGalleryImageSchema.parse(req.body);

      await db
        .update(schema.GalleryImage)
        .set({
          barberShopID: parsed.barberShopID,
          filePath: parsed.filePath,
          altText: parsed.altText,
          title: parsed.title ?? null,
          description: parsed.description ?? null,
          sortOrder: parsed.sortOrder ?? null,
        })
        .where(eq(schema.GalleryImage.imageID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('GalleryImageController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid imageID' });
      }

      await db
        .delete(schema.GalleryImage)
        .where(eq(schema.GalleryImage.imageID, id))
        .execute();

      res.json({ success: true });
    } catch (err) {
      console.error('GalleryImageController.delete error:', err);
      next(err);
    }
  }
}
