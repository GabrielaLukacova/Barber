import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';

// --- ZOD SCHEMAS ---

const openingHoursSchema = z.object({
  dayOfWeek: z.string().min(1, 'dayOfWeek is required'),
  openingTime: z.string().optional().nullable(),
  closingTime: z.string().optional().nullable(),
});

const timeOffSchema = z.object({
  start: z.string().min(1, 'start is required'),
  end: z.string().min(1, 'end is required'),
  reason: z.string().optional().nullable(),
});

const barberShopSchema = z.object({
  name: z.string().min(1, 'name is required'),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});
const postalCodeSchema = z.object({
  postalCode: z.string().min(1, 'postalCode is required'),
  city: z.string().min(1, 'city is required'),
});

// --- CONTROLLER IMPLEMENTATION ---

export class ConfigController {
  // OpeningHours ---------------------

  static async getOpeningHours(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.OpeningHours);
      res.json(rows);
    } catch (err) {
      console.error('ConfigController.getOpeningHours error:', err);
      next(err);
    }
  }

  static async getOpeningHour(req: Request, res: Response, next: NextFunction) {
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
        return res.status(404).json({ error: 'OpeningHours not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('ConfigController.getOpeningHour error:', err);
      next(err);
    }
  }

  static async createOpeningHours(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = openingHoursSchema.parse(req.body);

      const result = await db
        .insert(schema.OpeningHours)
        .values({
          dayOfWeek: parsed.dayOfWeek,
          openingTime: parsed.openingTime ?? null,
          closingTime: parsed.closingTime ?? null,
        })
        .execute();

      const insertId = (
        Array.isArray(result) ? (result as any)[0]?.insertId : (result as any).insertId
      ) as number | undefined;

      if (!insertId) {
        return res.status(201).json({ success: true });
      }

      const [created] = await db
        .select()
        .from(schema.OpeningHours)
        .where(eq(schema.OpeningHours.openingHoursID, insertId));

      res.status(201).json(created ?? { success: true, id: insertId });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.createOpeningHours error:', err);
      next(err);
    }
  }

  static async updateOpeningHours(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid openingHoursID' });
      }

      const parsed = openingHoursSchema.parse(req.body);

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
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.updateOpeningHours error:', err);
      next(err);
    }
  }

  static async deleteOpeningHours(req: Request, res: Response, next: NextFunction) {
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
      console.error('ConfigController.deleteOpeningHours error:', err);
      next(err);
    }
  }

  // TimeOff --------------------------

  static async getTimeOff(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.TimeOff);
      res.json(rows);
    } catch (err) {
      console.error('ConfigController.getTimeOff error:', err);
      next(err);
    }
  }

  static async getTimeOffOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      const [row] = await db.select().from(schema.TimeOff).where(eq(schema.TimeOff.timeOffID, id));

      if (!row) {
        return res.status(404).json({ error: 'TimeOff not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('ConfigController.getTimeOffOne error:', err);
      next(err);
    }
  }

  static async createTimeOff(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = timeOffSchema.parse(req.body);

      const result = await db
        .insert(schema.TimeOff)
        .values({
          start: parsed.start,
          end: parsed.end,
          reason: parsed.reason ?? null,
        })
        .execute();

      const insertId = (
        Array.isArray(result) ? (result as any)[0]?.insertId : (result as any).insertId
      ) as number | undefined;

      if (!insertId) {
        return res.status(201).json({ success: true });
      }

      const [created] = await db
        .select()
        .from(schema.TimeOff)
        .where(eq(schema.TimeOff.timeOffID, insertId));

      res.status(201).json(created ?? { success: true, id: insertId });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.createTimeOff error:', err);
      next(err);
    }
  }

  static async updateTimeOff(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      const parsed = timeOffSchema.parse(req.body);

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
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.updateTimeOff error:', err);
      next(err);
    }
  }

  static async deleteTimeOff(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid timeOffID' });
      }

      await db.delete(schema.TimeOff).where(eq(schema.TimeOff.timeOffID, id)).execute();
      res.json({ success: true });
    } catch (err) {
      console.error('ConfigController.deleteTimeOff error:', err);
      next(err);
    }
  }

  // BarberShop -----------------------

  static async getBarberShops(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.BarberShop);
      res.json(rows);
    } catch (err) {
      console.error('ConfigController.getBarberShops error:', err);
      next(err);
    }
  }

  static async getBarberShop(req: Request, res: Response, next: NextFunction) {
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
        return res.status(404).json({ error: 'BarberShop not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('ConfigController.getBarberShop error:', err);
      next(err);
    }
  }

  static async createBarberShop(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = barberShopSchema.parse(req.body);

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

      const insertId = (
        Array.isArray(result) ? (result as any)[0]?.insertId : (result as any).insertId
      ) as number | undefined;

      if (!insertId) {
        return res.status(201).json({ success: true });
      }

      const [created] = await db
        .select()
        .from(schema.BarberShop)
        .where(eq(schema.BarberShop.barberShopID, insertId));

      res.status(201).json(created ?? { success: true, id: insertId });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.createBarberShop error:', err);
      next(err);
    }
  }

  static async updateBarberShop(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      const parsed = barberShopSchema.parse(req.body);

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
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.updateBarberShop error:', err);
      next(err);
    }
  }

  static async deleteBarberShop(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid barberShopID' });
      }

      await db.delete(schema.BarberShop).where(eq(schema.BarberShop.barberShopID, id)).execute();
      res.json({ success: true });
    } catch (err) {
      console.error('ConfigController.deleteBarberShop error:', err);
      next(err);
    }
  }

  // PostalCode -----------------------

  static async getPostalCodes(_req: Request, res: Response, next: NextFunction) {
    try {
      const rows = await db.select().from(schema.PostalCode);
      res.json(rows);
    } catch (err) {
      console.error('ConfigController.getPostalCodes error:', err);
      next(err);
    }
  }

  static async getPostalCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      if (!code) {
        return res.status(400).json({ error: 'postalCode is required' });
      }

      const [row] = await db
        .select()
        .from(schema.PostalCode)
        .where(eq(schema.PostalCode.postalCode, code));

      if (!row) {
        return res.status(404).json({ error: 'PostalCode not found' });
      }

      res.json(row);
    } catch (err) {
      console.error('ConfigController.getPostalCode error:', err);
      next(err);
    }
  }

  static async createPostalCode(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = postalCodeSchema.parse(req.body);

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
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.createPostalCode error:', err);
      next(err);
    }
  }

  static async updatePostalCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      if (!code) {
        return res.status(400).json({ error: 'postalCode is required' });
      }

      const bodySchema = z.object({
        city: z.string().min(1, 'city is required'),
      });

      const parsed = bodySchema.parse(req.body);

      await db
        .update(schema.PostalCode)
        .set({ city: parsed.city })
        .where(eq(schema.PostalCode.postalCode, code))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }
      console.error('ConfigController.updatePostalCode error:', err);
      next(err);
    }
  }

  static async deletePostalCode(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;
      if (!code) {
        return res.status(400).json({ error: 'postalCode is required' });
      }

      await db.delete(schema.PostalCode).where(eq(schema.PostalCode.postalCode, code)).execute();
      res.json({ success: true });
    } catch (err) {
      console.error('ConfigController.deletePostalCode error:', err);
      next(err);
    }
  }
}
