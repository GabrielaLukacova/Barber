import type { Request, Response, NextFunction } from 'express';
import { and, asc, eq } from 'drizzle-orm';
import { db } from '../db/db';
import * as schema from '../db/schema';
import { supabase } from '../lib/supabase';

const BARBER_SHOP_ID = (() => {
  const raw = process.env.BARBER_SHOP_ID;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 4;
})();

function getFiles(req: Request): Express.Multer.File[] {
  const files = (req.files ?? []) as unknown;

  if (Array.isArray(files)) return files as Express.Multer.File[];

  if (files && typeof files === 'object') {
    const dict = files as Record<string, Express.Multer.File[]>;
    return dict.images ?? [];
  }

  return [];
}

async function uploadToSupabase(file: Express.Multer.File) {
  const fileName = `gallery/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('gallery')
    .getPublicUrl(fileName);

  return data.publicUrl;
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
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const existing = await db
        .select({ sortOrder: schema.GalleryImage.sortOrder })
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID));

      const maxSort = existing.reduce((m, r) => Math.max(m, r.sortOrder ?? 0), 0);
      let nextSort = maxSort + 1;

      const values = [];

      for (const f of files) {
        const publicUrl = await uploadToSupabase(f);

        values.push({
          barberShopID: BARBER_SHOP_ID,
          filePath: publicUrl,
          sortOrder: nextSort++,
        });
      }

      await db.insert(schema.GalleryImage).values(values);

      const rows = await db
        .select()
        .from(schema.GalleryImage)
        .where(eq(schema.GalleryImage.barberShopID, BARBER_SHOP_ID))
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

      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid image ID' });
      }

      await db
        .update(schema.GalleryImage)
        .set({ sortOrder })
        .where(eq(schema.GalleryImage.imageID, id));

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid image ID' });
      }

      await db
        .delete(schema.GalleryImage)
        .where(eq(schema.GalleryImage.imageID, id));

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}