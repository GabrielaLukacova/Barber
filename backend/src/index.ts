import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './db';
import { services, barbers, appointments } from './schema';
import { eq, asc } from 'drizzle-orm';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/services', async (_req, res) => {
  const rows = await db.select().from(services).where(eq(services.active, true)).orderBy(asc(services.name));
  res.json(rows);
});

app.get('/barbers', async (_req, res) => {
  const rows = await db.select().from(barbers).orderBy(asc(barbers.displayName));
  res.json(rows);
});

app.get('/availability', async (req, res) => {
  const schemaQ = z.object({ serviceId: z.string(), barberId: z.string().optional(), date: z.string().optional() });
  const { serviceId } = schemaQ.parse(req.query);
  const svc = (await db.select().from(services).where(eq(services.id, serviceId)).limit(1))[0];
  if (!svc) return res.json({ slots: [] });
  const slots = ['09:00','09:30','10:00','10:30','11:00','13:00','13:30','14:00','14:30','15:00'];
  res.json({ slots, durationMin: svc.durationMin });
});

app.post('/appointments', async (req, res) => {
  const schemaBody = z.object({
    serviceId: z.string(),
    barberId: z.string(),
    customerName: z.string().min(1),
    customerEmail: z.string().email(),
    customerPhone: z.string().optional(),
    start: z.string(),
    end: z.string()
  });
  const data = schemaBody.parse(req.body);
  const row = await db.insert(appointments).values({
    serviceId: data.serviceId,
    barberId: data.barberId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    start: new Date(data.start).getTime(),
    end: new Date(data.end).getTime(),
    status: 'BOOKED'
  }).returning();
  res.status(201).json(row[0]);
});

const port = Number(process.env.PORT || 3333);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
