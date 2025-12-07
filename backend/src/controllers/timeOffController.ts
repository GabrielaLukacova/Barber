import type { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import {
  createTimeOffSchema,
  updateTimeOffSchema,
} from '../validation/timeOffSchemas';

export class TimeOffController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await db.select().from(schema.TimeOff);
      res.json(list);
    } catch (err) {
      console.error('TimeOffController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      const [row] = await db
        .select()
        .from(schema.TimeOff)
        .where(eq(schema.TimeOff.timeOffID, id));

      if (!row) {
        return res.status(404).json({ error: 'Time off not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('TimeOffController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createTimeOffSchema.parse(req.body);

      const result = await db
        .insert(schema.TimeOff)
        .values({
          start: parsed.start,
          end: parsed.end,
          reason: parsed.reason ?? null,
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
      console.error('TimeOffController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      const parsed = updateTimeOffSchema.parse(req.body);

      await db
        .update(schema.TimeOff)
        .set({
          start: parsed.start,
          end: parsed.end,
          reason: parsed.reason ?? null,
        })
        .where(eq(schema.TimeOff.timeOffID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation error',
          details: err.issues?.map((i: any) => i.message) ?? [],
        });
      }
      console.error('TimeOffController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      await db
        .delete(schema.TimeOff)
        .where(eq(schema.TimeOff.timeOffID, id))
        .execute();

      res.json({ success: true });
    } catch (err) {
      console.error('TimeOffController.delete error:', err);
      next(err);
    }
  }
}
