import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import {
  createBarberShopSchema,
  updateBarberShopSchema,
} from '../validation/barberShopSchemas';

async function upsertPostalCode(postalCode: string, city: string) {
  // Postgres upsert
  await db
    .insert(schema.PostalCode)
    .values({ postalCode, city })
    // drizzle pg supports onConflictDoUpdate
    .onConflictDoUpdate({
      target: schema.PostalCode.postalCode,
      set: { city },
    })
    .execute();
}

export class BarberShopController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db
        .select({
          barberShopID: schema.BarberShop.barberShopID,
          name: schema.BarberShop.name,
          phoneNumber: schema.BarberShop.phoneNumber,
          email: schema.BarberShop.email,
          street: schema.BarberShop.street,
          postalCode: schema.BarberShop.postalCode,
          city: schema.PostalCode.city,
          description: schema.BarberShop.description,
        })
        .from(schema.BarberShop)
        .leftJoin(
          schema.PostalCode,
          eq(schema.BarberShop.postalCode, schema.PostalCode.postalCode),
        );

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
        .select({
          barberShopID: schema.BarberShop.barberShopID,
          name: schema.BarberShop.name,
          phoneNumber: schema.BarberShop.phoneNumber,
          email: schema.BarberShop.email,
          street: schema.BarberShop.street,
          postalCode: schema.BarberShop.postalCode,
          city: schema.PostalCode.city,
          description: schema.BarberShop.description,
        })
        .from(schema.BarberShop)
        .leftJoin(
          schema.PostalCode,
          eq(schema.BarberShop.postalCode, schema.PostalCode.postalCode),
        )
        .where(eq(schema.BarberShop.barberShopID, id));

      if (!row) return res.status(404).json({ error: 'Barber shop not found' });

      res.json(row);
    } catch (err) {
      console.error('BarberShopController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createBarberShopSchema.parse(req.body);

      // If both provided, update PostalCode table
      if (parsed.postalCode && parsed.city) {
        await upsertPostalCode(parsed.postalCode, parsed.city);
      }

      const result = await db
        .insert(schema.BarberShop)
        .values({
          name: parsed.name,
          phoneNumber: parsed.phoneNumber ?? null,
          email: parsed.email ?? null,
          street: parsed.street ?? null,
          postalCode: parsed.postalCode ?? null,
          description: parsed.description ?? null,
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

      if (parsed.postalCode && parsed.city) {
        await upsertPostalCode(parsed.postalCode, parsed.city);
      }

      await db
        .update(schema.BarberShop)
        .set({
          name: parsed.name,
          phoneNumber: parsed.phoneNumber ?? null,
          email: parsed.email ?? null,
          street: parsed.street ?? null,
          postalCode: parsed.postalCode ?? null,
          description: parsed.description ?? null,
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
