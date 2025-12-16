import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '../db/db';

const appointmentSchema = z.object({
  clientID: z
    .union([z.number().int().positive(), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
  appointmentDate: z.string().min(1, 'appointmentDate is required'),
  startTime: z.string().min(1, 'startTime is required'),
  endTime: z.string().min(1, 'endTime is required'),
  status: z.enum(['BOOKED', 'CANCELLED', 'COMPLETED']).default('BOOKED'),
  totalPriceCents: z
    .union([z.number().int().nonnegative(), z.null()])
    .optional()
    .transform((v) => (v === undefined ? null : v)),
});

export class AppointmentController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const appointments = await db.select().from(schema.Appointment);
      res.json(appointments);
    } catch (err) {
      console.error('AppointmentController.getAll error:', err);
      next(err);
    }
  }

  static async getAllWithDetails(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.execute(sql`
        SELECT
          a."appointmentID",
          a."appointmentDate",
          a."startTime",
          a."endTime",
          a."status",
          a."totalPriceCents",
          c."clientID",
          c."firstName",
          c."lastName",
          c."email",
          c."phoneNumber",
          COALESCE(
            json_agg(
              json_build_object(
                'serviceID', s."serviceID",
                'name', s."name",
                'duration', aps."duration",
                'price', aps."price"
              )
            ) FILTER (WHERE s."serviceID" IS NOT NULL),
            '[]'::json
          ) AS services
        FROM "Appointment" a
        LEFT JOIN "Client" c ON c."clientID" = a."clientID"
        LEFT JOIN "AppointmentService" aps ON aps."appointmentID" = a."appointmentID"
        LEFT JOIN "Service" s ON s."serviceID" = aps."serviceID"
        GROUP BY a."appointmentID", c."clientID"
        ORDER BY a."appointmentDate" DESC, a."startTime" DESC
      `);

      res.json((rows as any)?.rows ?? []);
    } catch (err) {
      console.error('AppointmentController.getAllWithDetails error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
      }

      const [appointment] = await db
        .select()
        .from(schema.Appointment)
        .where(eq(schema.Appointment.appointmentID, id));

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json(appointment);
    } catch (err) {
      console.error('AppointmentController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = appointmentSchema.parse(req.body);

      const result = await db
        .insert(schema.Appointment)
        .values({
          clientID: parsed.clientID ?? null,
          appointmentDate: parsed.appointmentDate,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          status: parsed.status,
          totalPriceCents: parsed.totalPriceCents ?? null,
        })
        .execute();

      const insertId = (Array.isArray(result) ? (result as any)[0]?.insertId : (result as any).insertId) as
        | number
        | undefined;

      if (!insertId) {
        return res.status(201).json({ success: true });
      }

      const [created] = await db
        .select()
        .from(schema.Appointment)
        .where(eq(schema.Appointment.appointmentID, insertId));

      res.status(201).json(created ?? { success: true, id: insertId });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

      console.error('AppointmentController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
      }

      const parsed = appointmentSchema.parse(req.body);

      await db
        .update(schema.Appointment)
        .set({
          clientID: parsed.clientID ?? null,
          appointmentDate: parsed.appointmentDate,
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          status: parsed.status,
          totalPriceCents: parsed.totalPriceCents ?? null,
        })
        .where(eq(schema.Appointment.appointmentID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

      console.error('AppointmentController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
      }

      await db.delete(schema.Appointment).where(eq(schema.Appointment.appointmentID, id)).execute();
      res.json({ success: true });
    } catch (err) {
      console.error('AppointmentController.delete error:', err);
      next(err);
    }
  }
}
