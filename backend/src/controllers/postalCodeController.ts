import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import { createPostalCodeSchema, updatePostalCodeSchema } from '../validation/postalCodeSchemas';

export class PostalCodeController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.PostalCode);
      res.json(rows);
    } catch (err) {
      console.error('PostalCodeController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      // require postal code param
      if (!code) return res.status(400).json({ error: 'postalCode is required' });

      const [row] = await db
        .select()
        .from(schema.PostalCode)
        .where(eq(schema.PostalCode.postalCode, code));

      if (!row) {
        return res.status(404).json({ error: 'Postal code not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('PostalCodeController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createPostalCodeSchema.parse(req.body);

      await db
        .insert(schema.PostalCode)
        .values({
          postalCode: parsed.postalCode,
          city: parsed.city,
        })
        .execute();

      res.status(201).json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('PostalCodeController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      // require postal code param
      if (!code) return res.status(400).json({ error: 'postalCode is required' });

      const parsed = updatePostalCodeSchema.parse(req.body);

      await db
        .update(schema.PostalCode)
        .set({ city: parsed.city })
        .where(eq(schema.PostalCode.postalCode, code))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('PostalCodeController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      // require postal code param
      if (!code) return res.status(400).json({ error: 'postalCode is required' });

      await db.delete(schema.PostalCode).where(eq(schema.PostalCode.postalCode, code)).execute();

      res.json({ success: true });
    } catch (err) {
      console.error('PostalCodeController.delete error:', err);
      next(err);
    }
  }
}