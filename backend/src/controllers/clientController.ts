import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';

// Zod schema for validating clients
const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phoneNumber: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export class ClientController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await db.select().from(schema.Client);
      res.json(clients);
    } catch (err) {
      console.error('ClientController.getAll error:', err);
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID' });
      }

      const [client] = await db
        .select()
        .from(schema.Client)
        .where(eq(schema.Client.clientID, id));

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (err) {
      console.error('ClientController.getOne error:', err);
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = clientSchema.parse(req.body);

      const result = await db
        .insert(schema.Client)
        .values({
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          email: parsed.email,
          phoneNumber: parsed.phoneNumber ?? null,
          note: parsed.note ?? null,
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
        .from(schema.Client)
        .where(eq(schema.Client.clientID, insertId));

      res.status(201).json(created ?? { success: true, id: insertId });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

      console.error('ClientController.create error:', err);
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID' });
      }

      const parsed = clientSchema.parse(req.body);

      await db
        .update(schema.Client)
        .set({
          firstName: parsed.firstName,
          lastName: parsed.lastName,
          email: parsed.email,
          phoneNumber: parsed.phoneNumber ?? null,
          note: parsed.note ?? null,
        })
        .where(eq(schema.Client.clientID, id))
        .execute();

      res.json({ success: true });
    } catch (err: any) {
      if (err?.name === 'ZodError') {
        const issues = err.issues?.map((i: any) => i.message) ?? [];
        return res.status(400).json({ error: 'Validation error', details: issues });
      }

      console.error('ClientController.update error:', err);
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid client ID' });
      }

      await db.delete(schema.Client).where(eq(schema.Client.clientID, id)).execute();
      res.json({ success: true });
    } catch (err) {
      console.error('ClientController.delete error:', err);
      next(err);
    }
  }
}
