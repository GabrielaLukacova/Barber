import type { Request, Response, NextFunction } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../db/db';
import * as schema from '../db/schema';

const BARBER_SHOP_ID = (() => {
  const raw = process.env.BARBER_SHOP_ID;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 4;
})();

const GALLERY_DIR = path.join(process.cwd(), 'uploads', 'gallery');

function getFiles(req: Request): Express.Multer.File[] {
  // upload.array('images') should set req.files to an array
  const files = (req.files ?? []) as unknown;

  if (Array.isArray(files)) return files as Express.Multer.File[];

  // fallback if something ever changes
  if (files && typeof files === 'object') {
    const dict = files as Record<string, Express.Multer.File[]>;
    return dict.images ?? [];
  }

  return [];
}

function getBarberShopId(req: Request): number {
  // Keep your old behavior: default to env BARBER_SHOP_ID
  // But if frontend sends barberShopID, accept it (doesn't break old logic).
  const raw = (req.body?.barberShopID ?? '').toString().trim();
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : BARBER_SHOP_ID;
}

export class GalleryImageController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db
        .select()
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID))
        .orderBy(asc(schema.GalleryImage.sortOrder), asc(schema.GalleryImage.imageID));

      res.json(rows);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const files = getFiles(req);
      if (!files.length) {
        return res.status(400).json({
          error: 'No files uploaded',
          message: "Expected multipart field name 'images' (upload.array('images', ...)).",
        });
      }

      const barberShopID = getBarberShopId(req);

      // append at end (same logic)
      const existing = await db
        .select({ sortOrder: schema.GalleryImage.sortOrder })
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.barberShopID, barberShopID));

      const maxSort = existing.reduce((m, r) => Math.max(m, r.sortOrder ?? 0), 0);
      let nextSort = maxSort + 1;

      const values = files.map((f) => ({
        barberShopID,
        filePath: `/uploads/gallery/${f.filename}`,
        sortOrder: nextSort++,
      }));

      await db.insert(schema.GalleryImage).values(values);

      const rows = await db
        .select()
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.barberShopID, barberShopID))
        .orderBy(asc(schema.GalleryImage.sortOrder), asc(schema.GalleryImage.imageID));

      res.status(201).json(rows);
    } catch (err) {
      next(err);
    }
  }

  static async updateSortOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const sortOrder = Number(req.body?.sortOrder);

      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid image ID' });
      if (Number.isNaN(sortOrder)) return res.status(400).json({ error: 'Invalid sortOrder' });

      await db
        .update(schema.GalleryImage)
        .set({ sortOrder })
        .where(
          and(
            eq(schema.GalleryImage.imageID, id),
            eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID),
          ),
        );

      const [row] = await db
        .select()
        .from(schema.GalleryImage)
        .where(
          and(
            eq(schema.GalleryImage.imageID, id),
            eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID),
          ),
        );

      if (!row) return res.status(404).json({ error: 'Image not found' });
      res.json(row);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid image ID' });

      const [row] = await db
        .select()
        .from(schema.GalleryImage)
        .where(
          and(
            eq(schema.GalleryImage.imageID, id),
            eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID),
          ),
        );

      if (!row) return res.status(404).json({ error: 'Image not found' });

      await db
        .delete(schema.GalleryImage)
        .where(
          and(
            eq(schema.GalleryImage.imageID, id),
            eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID),
          ),
        );

      const filename = path.basename(row.filePath);
      await fs.unlink(path.join(GALLERY_DIR, filename)).catch(() => undefined);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}