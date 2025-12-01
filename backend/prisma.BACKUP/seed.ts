import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  const kim = await prisma.barber.create({ data: { displayName: 'Kim' } });
  await prisma.barber.create({ data: { displayName: 'Thomas' } });

  await prisma.service.createMany({
    data: [
      { name: 'Haircut', durationMin: 30, priceCents: 28000 },
      { name: 'Beard Trim', durationMin: 20, priceCents: 18000 },
      { name: 'Haircut + Beard', durationMin: 45, priceCents: 40000 },
    ],
    skipDuplicates: true
  });

  const days = [2,3,4,5].map(weekday => ({ weekday, opens:'09:00', closes:'18:00' }));
  days.push({ weekday:6, opens:'09:00', closes:'14:00' });
  for (const d of days) await prisma.workingHours.create({ data: { barberId: kim.id, ...d }});
}
run().finally(()=>process.exit(0));
