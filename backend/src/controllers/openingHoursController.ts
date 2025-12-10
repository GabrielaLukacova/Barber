import type { Request, Response, NextFunction } from 'express';
import { eq, sql } from 'drizzle-orm';
import { db, schema } from '../db/db';
import {
  createOpeningHoursSchema,
  updateOpeningHoursSchema,
} from '../validation/openingHoursSchemas';

export class OpeningHoursController {
  // Uses DB VIEW: shop_opening_hours
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const viewResult = await db.execute(
        sql`SELECT "dayOfWeek", "openingTime", "closingTime" FROM "shop_opening_hours"`
      );
      const viewRows = (viewResult as any).rows ?? (viewResult as any);

      const tableRows = await db.select().from(schema.OpeningHours);
      const idByDay = new Map(
        (tableRows as any[]).map((row) => [row.dayOfWeek, row.openingHoursID]),
      );

      const merged = (viewRows as any[]).map((row) => {
        const id = idByDay.get(row.dayOfWeek);
        if (!id) {
          throw new Error(`No OpeningHours row found for dayOfWeek=${row.dayOfWeek}`);
        }
        return {
          openingHoursID: id,
          dayOfWeek: row.dayOfWeek,
          openingTime: row.openingTime,
          closingTime: row.closingTime,
        };
      });

      res.json(merged);
    } catch (err) {
      console.error('OpeningHoursController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid openingHoursID' });
      }

      const [row] = await db
        .select()
        .from(schema.OpeningHours)
        .where(eq(schema.OpeningHours.openingHoursID, id));

      if (!row) {
        return res.status(404).json({ error: 'Opening hours not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('OpeningHoursController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createOpeningHoursSchema.parse(req.body);

      const result = await db
        .insert(schema.OpeningHours)
        .values({
          dayOfWeek: parsed.dayOfWeek,
          openingTime: parsed.openingTime ?? null,
          closingTime: parsed.closingTime ?? null,
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
      console.error('OpeningHoursController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid openingHoursID' });
      }

      const parsed = updateOpeningHoursSchema.parse(req.body);

      await db
        .update(schema.OpeningHours)
        .set({
          dayOfWeek: parsed.dayOfWeek,
          openingTime: parsed.openingTime ?? null,
          closingTime: parsed.closingTime ?? null,
        })
        .where(eq(schema.OpeningHours.openingHoursID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('OpeningHoursController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid openingHoursID' });
      }

      await db
        .delete(schema.OpeningHours)
        .where(eq(schema.OpeningHours.openingHoursID, id))
        .execute();

      res.json({ success: true });
    } catch (err) {
      console.error('OpeningHoursController.delete error:', err);
      next(err);
    }
  }
}
