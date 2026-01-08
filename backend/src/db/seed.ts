import { db } from './db';
import { barbers, services, appointments } from './schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('🧹 Clearing existing data...');
  await db.run(sql`DELETE FROM appointments;`);
  await db.run(sql`DELETE FROM barbers;`);
  await db.run(sql`DELETE FROM services;`);

  console.log('💈 Inserting services...');
  const basicCutId = 'svc_basic_cut';
  const fadeCutId = 'svc_fade_cut';
  const beardTrimId = 'svc_beard_trim';

  await db.insert(services).values([
    {
      id: basicCutId,
      name: 'Basic Cut',
      durationMin: 30,
      priceCents: 25000,
      active: 1,
    },
    {
      id: fadeCutId,
      name: 'Skin Fade',
      durationMin: 45,
      priceCents: 35000,
      active: 1,
    },
    {
      id: beardTrimId,
      name: 'Beard Trim',
      durationMin: 20,
      priceCents: 15000,
      active: 1,
    },
  ]);

  console.log('👨‍🦱 Inserting barbers...');
  const kimId = 'barber_kim';
  const alexId = 'barber_alex';

  await db.insert(barbers).values([
    { id: kimId, displayName: 'Kim', color: '#C7A47D' },
    { id: alexId, displayName: 'Alex', color: '#A7D3C7' },
  ]);

  console.log('📅 Inserting sample appointments...');
  const now = Date.now();
  const thirtyMin = 30 * 60 * 1000;

  await db.insert(appointments).values([
    {
      id: 'appt_1',
      serviceId: basicCutId,
      barberId: kimId,
      customerName: 'Test Customer 1',
      customerEmail: 'test1@example.com',
      customerPhone: '12345678',
      start: now + 60 * 60 * 1000,
      end: now + 60 * 60 * 1000 + thirtyMin,
      status: 'BOOKED',
      createdAt: now,
    },
    {
      id: 'appt_2',
      serviceId: fadeCutId,
      barberId: alexId,
      customerName: 'Test Customer 2',
      customerEmail: 'test2@example.com',
      customerPhone: '87654321',
      start: now + 2 * 60 * 60 * 1000,
      end: now + 2 * 60 * 60 * 1000 + thirtyMin,
      status: 'CONFIRMED',
      createdAt: now,
    },
  ]);

  console.log('Seed completed.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));