import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';

// zod payload schema
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

  // admin list with joins
  static async getAllWithDetails(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db
        .select({
          appointmentID: schema.Appointment.appointmentID,
          appointmentDate: schema.Appointment.appointmentDate,
          startTime: schema.Appointment.startTime,
          endTime: schema.Appointment.endTime,
          status: schema.Appointment.status,
          totalPriceCents: schema.Appointment.totalPriceCents,
          clientID: schema.Appointment.clientID,

          firstName: schema.Client.firstName,
          lastName: schema.Client.lastName,
          email: schema.Client.email,
          phoneNumber: schema.Client.phoneNumber,

          serviceID: schema.Service.serviceID,
          serviceName: schema.Service.name,
          serviceDuration: schema.AppointmentService.duration,
          servicePrice: schema.AppointmentService.price,
        })
        .from(schema.Appointment)
        .leftJoin(schema.Client, eq(schema.Client.clientID, schema.Appointment.clientID))
        .leftJoin(
          schema.AppointmentService,
          eq(schema.AppointmentService.appointmentID, schema.Appointment.appointmentID),
        )
        .leftJoin(schema.Service, eq(schema.Service.serviceID, schema.AppointmentService.serviceID));

      // group by appointment id
      const map = new Map<number, any>();

      for (const r of rows) {
        const id = r.appointmentID;
        if (!map.has(id)) {
          map.set(id, {
            appointmentID: id,
            appointmentDate: r.appointmentDate,
            startTime: r.startTime,
            endTime: r.endTime,
            status: r.status,
            totalPriceCents: r.totalPriceCents ?? null,
            clientID: r.clientID ?? null,
            firstName: r.firstName ?? null,
            lastName: r.lastName ?? null,
            email: r.email ?? null,
            phoneNumber: r.phoneNumber ?? null,
            services: [] as Array<{
              serviceID: number;
              name: string;
              duration: number;
              price: number;
            }>,
          });
        }

        if (typeof r.serviceID === 'number') {
          map.get(id).services.push({
            serviceID: r.serviceID,
            name: r.serviceName ?? '',
            duration: Number(r.serviceDuration ?? 0),
            price: Number(r.servicePrice ?? 0),
          });
        }
      }

      // newest first
      const out = Array.from(map.values()).sort((a, b) => {
        const ad = String(a.appointmentDate || '');
        const bd = String(b.appointmentDate || '');
        if (ad !== bd) return bd.localeCompare(ad);
        return String(b.startTime || '').localeCompare(String(a.startTime || ''));
      });

      res.json(out);
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

      // handle driver insert id
      const insertId = (
        Array.isArray(result) ? (result as any)[0]?.insertId : (result as any).insertId
      ) as number | undefined;

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

      // partial update
      const parsed = appointmentSchema.partial().parse(req.body);

      await db
        .update(schema.Appointment)
        .set({
          clientID: parsed.clientID ?? undefined,
          appointmentDate: parsed.appointmentDate ?? undefined,
          startTime: parsed.startTime ?? undefined,
          endTime: parsed.endTime ?? undefined,
          status: parsed.status ?? undefined,
          totalPriceCents: parsed.totalPriceCents ?? undefined,
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