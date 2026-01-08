import { and, eq, inArray, sql } from 'drizzle-orm';
import { db, schema } from '../db/db';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map((x) => Number(x));
  return h * 60 + m;
}
function fromMinutes(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, '0');
  const m = String(min % 60).padStart(2, '0');
  return `${h}:${m}`;
}
function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

export async function getAvailableSlots(params: {
  barberShopID: number;
  dateISO: string;
  serviceIDs: number[];
}) {
  const services = await db
    .select()
    .from(schema.Service)
    .where(inArray(schema.Service.serviceID, params.serviceIDs));

  if (!services.length) return { durationMin: 0, slots: [] as string[] };

  const durationMin = services.reduce((sum, s: any) => sum + (s.duration ?? 0), 0);

  const d = new Date(params.dateISO + 'T00:00:00');
  const dayName = DAY_NAMES[d.getDay()];

  const [oh] = await db
    .select()
    .from(schema.OpeningHours)
    .where(eq(schema.OpeningHours.dayOfWeek, dayName));

  if (!oh?.openingTime || !oh?.closingTime) return { durationMin, slots: [] as string[] };

  const openMin = toMinutes(String(oh.openingTime).slice(0, 5));
  const closeMin = toMinutes(String(oh.closingTime).slice(0, 5));
  if (closeMin <= openMin) return { durationMin, slots: [] as string[] };

  const appts = await db
    .select({ startTime: schema.Appointment.startTime, endTime: schema.Appointment.endTime })
    .from(schema.Appointment)
    .where(
      and(
        eq(schema.Appointment.appointmentDate, params.dateISO),
        eq(schema.Appointment.status, 'BOOKED'),
      ),
    );

  const busyRanges = appts.map((a: any) => ({
    start: toMinutes(String(a.startTime).slice(0, 5)),
    end: toMinutes(String(a.endTime).slice(0, 5)),
  }));

  const dayStart = params.dateISO + 'T00:00:00.000Z';
  const dayEnd = params.dateISO + 'T23:59:59.999Z';

  const timeOff = await db
    .select()
    .from(schema.TimeOff)
    .where(sql`${schema.TimeOff.start} <= ${dayEnd} AND ${schema.TimeOff.end} >= ${dayStart}`);

  const offRanges = timeOff.map((t: any) => {
    const start = new Date(t.start);
    const end = new Date(t.end);
    const startMin =
      start.toISOString().slice(0, 10) === params.dateISO
        ? toMinutes(start.toISOString().slice(11, 16))
        : 0;
    const endMin =
      end.toISOString().slice(0, 10) === params.dateISO
        ? toMinutes(end.toISOString().slice(11, 16))
        : 24 * 60;
    return { start: startMin, end: endMin };
  });

  const step = 15;
  const latestStart = closeMin - durationMin;
  if (latestStart < openMin) return { durationMin, slots: [] as string[] };

  const slots: string[] = [];
  for (let t = openMin; t <= latestStart; t += step) {
    const end = t + durationMin;
    const blocked =
      busyRanges.some((b) => overlaps(t, end, b.start, b.end)) ||
      offRanges.some((o) => overlaps(t, end, o.start, o.end));
    if (!blocked) slots.push(fromMinutes(t));
  }

  return { durationMin, slots };
}

export async function createPublicBooking(params: {
  barberShopID: number;
  serviceIDs: number[];
  dateISO: string;
  startTimeHHMM: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  const services = await db
    .select()
    .from(schema.Service)
    .where(inArray(schema.Service.serviceID, params.serviceIDs));

  if (!services.length) throw new Error('Selected services not found');

  const durationMin = services.reduce((sum, s: any) => sum + (s.duration ?? 0), 0);
  const totalPriceCents = services.reduce((sum, s: any) => sum + (s.price ?? 0) * 100, 0);

  const startMin = toMinutes(params.startTimeHHMM);
  const dayName = DAY_NAMES[new Date(params.dateISO + 'T00:00:00').getDay()];

  const [oh] = await db
    .select()
    .from(schema.OpeningHours)
    .where(eq(schema.OpeningHours.dayOfWeek, dayName));

  if (!oh?.openingTime || !oh?.closingTime) throw new Error('Closed on selected date');

  const openMin = toMinutes(String(oh.openingTime).slice(0, 5));
  const closeMin = toMinutes(String(oh.closingTime).slice(0, 5));
  const endMin = startMin + durationMin;

  if (startMin < openMin || endMin > closeMin)
    throw new Error('Selected time is outside opening hours');

  const startTime = params.startTimeHHMM + ':00';
  const endTime = fromMinutes(endMin) + ':00';

  const overlapsCount = await db.execute(sql`
    SELECT COUNT(*)::int AS c
    FROM "Appointment"
    WHERE "appointmentDate" = ${params.dateISO}
      AND "status" = 'BOOKED'
      AND (${startTime} < "endTime")
      AND ("startTime" < ${endTime})
  `);

  const c = (overlapsCount as any)?.rows?.[0]?.c ?? 0;
  if (c > 0) {
    const e: any = new Error('Time slot is no longer available');
    e.code = 'DOUBLE_BOOKING';
    throw e;
  }

  let clientID: number | null = null;

  if (params.customerEmail) {
    const existing = await db
      .select()
      .from(schema.Client)
      .where(eq(schema.Client.email, params.customerEmail))
      .limit(1);
    if (existing[0]) clientID = (existing[0] as any).clientID;
  }

  if (!clientID) {
    const name = params.customerName.trim();
    const parts = name.split(/\s+/);
    const firstName = (parts[0] || 'Guest').slice(0, 15);
    const lastName = (parts.slice(1).join(' ') || 'Client').slice(0, 15);
    const email = (params.customerEmail || `guest+${Date.now()}@example.invalid`).slice(0, 50);

    const inserted = await db
      .insert(schema.Client)
      .values({
        firstName,
        lastName,
        email,
        phoneNumber: params.customerPhone ?? null,
        note: null,
      })
      .returning({ clientID: schema.Client.clientID });

    clientID = (inserted[0] as any)?.clientID ?? null;
  }

  const insertedAppt = await db
    .insert(schema.Appointment)
    .values({
      clientID,
      appointmentDate: params.dateISO,
      startTime,
      endTime,
      status: 'BOOKED',
      totalPriceCents,
    })
    .returning({ appointmentID: schema.Appointment.appointmentID });

  const appointmentID = (insertedAppt[0] as any)?.appointmentID as number;

  await db.insert(schema.AppointmentService).values(
    services.map((s: any) => ({
      appointmentID,
      serviceID: s.serviceID,
      price: s.price ?? 0,
      duration: s.duration ?? 0,
    })),
  );

  return { appointmentID };
}
