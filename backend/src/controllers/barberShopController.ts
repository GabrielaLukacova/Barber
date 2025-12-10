import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import {
  createBarberShopSchema,
  updateBarberShopSchema,
} from '../validation/barberShopSchemas';

// Helper: convert "" / whitespace / undefined to null
function toNullable(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export class BarberShopController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.BarberShop);
      res.json(rows);
    } catch (err) {
      console.error('BarberShopController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      const [row] = await db
        .select()
        .from(schema.BarberShop)
        .where(eq(schema.BarberShop.barberShopID, id));

      if (!row) {
        return res.status(404).json({ error: 'Barber shop not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('BarberShopController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createBarberShopSchema.parse(req.body);

      const result = await db
        .insert(schema.BarberShop)
        .values({
          name: parsed.name,
          phoneNumber: toNullable(parsed.phoneNumber),
          email: toNullable(parsed.email),
          street: toNullable(parsed.street),
          postalCode: toNullable(parsed.postalCode),
          description: toNullable(parsed.description),
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
      console.error('BarberShopController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      const parsed = updateBarberShopSchema.parse(req.body);

      await db
        .update(schema.BarberShop)
        .set({
          name: parsed.name,
          phoneNumber: toNullable(parsed.phoneNumber),
          email: toNullable(parsed.email),
          street: toNullable(parsed.street),
          postalCode: toNullable(parsed.postalCode),
          description: toNullable(parsed.description),
        })
        .where(eq(schema.BarberShop.barberShopID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('BarberShopController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      await db
        .delete(schema.BarberShop)
        .where(eq(schema.BarberShop.barberShopID, id))
        .execute();

      res.json({ success: true });
    } catch (err) {
      console.error('BarberShopController.delete error:', err);
      next(err);
    }
  }
}