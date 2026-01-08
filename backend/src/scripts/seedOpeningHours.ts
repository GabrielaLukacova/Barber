import 'dotenv/config';
import { db, schema } from '../db/db';

async function main() {
  const { OpeningHours } = schema;

  await db.delete(OpeningHours);

  await db.insert(OpeningHours).values([
    { dayOfWeek: 'Monday', openingTime: '09:00:00', closingTime: '18:00:00' },
    { dayOfWeek: 'Tuesday', openingTime: '09:00:00', closingTime: '18:00:00' },
    { dayOfWeek: 'Wednesday', openingTime: '09:00:00', closingTime: '18:00:00' },
    { dayOfWeek: 'Thursday', openingTime: '09:00:00', closingTime: '18:00:00' },
    { dayOfWeek: 'Friday', openingTime: '09:00:00', closingTime: '18:00:00' },
    { dayOfWeek: 'Saturday', openingTime: '10:00:00', closingTime: '14:00:00' },
    { dayOfWeek: 'Sunday', openingTime: null, closingTime: null },
  ]);

  console.log('OpeningHours seeded');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
  });