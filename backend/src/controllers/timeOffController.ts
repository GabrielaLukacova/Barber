import type { Request, Response, NextFunction } from 'express';
import { asc, eq, gte } from 'drizzle-orm';
import { db, schema } from '../db/db';
import { createTimeOffSchema, updateTimeOffSchema } from '../validation/timeOffSchemas';

export class TimeOffController {
  static async getAllFuture(_req: Request, res: Response, next: NextFunction) {
    try {
      const nowIso = new Date().toISOString();

      const list = await db
        .select()
        .from(schema.TimeOff)
        .where(gte(schema.TimeOff.start, nowIso))
        .orderBy(asc(schema.TimeOff.start));

      res.json(list);
    } catch (err) {
      console.error('TimeOffController.getAllFuture error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createTimeOffSchema.parse(req.body);

      const result = await db
        .insert(schema.TimeOff)
        .values({
          start: new Date(parsed.start).toISOString(),
          end: new Date(parsed.end).toISOString(),
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
          start: parsed.start ? new Date(parsed.start).toISOString() : undefined,
          end: parsed.end ? new Date(parsed.end).toISOString() : undefined,
          reason: parsed.reason === undefined ? undefined : parsed.reason ?? null,
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
