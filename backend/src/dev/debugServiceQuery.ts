import 'dotenv/config';
import { db } from '../db/db';
import { Service } from '../db/schema';
import { desc } from 'drizzle-orm';

async function main() {
  try {
    const rows = await db
      .select()
      .from(Service)
      .orderBy(desc(Service.serviceID));

    console.log('Services:', rows);
  } catch (err: any) {
    console.error('DEBUG Drizzle Service query failed:', err?.message || err);
    if (err?.cause) {
      console.error('CAUSE:', err.cause);
    }
  }
}

main().then(() => process.exit(0));