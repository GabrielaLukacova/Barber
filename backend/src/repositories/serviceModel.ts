import { db, schema } from '../db/db';
import { eq, desc } from 'drizzle-orm';

const { Service, AppointmentService } = schema;

// Type inferred from Drizzle schema
export type ServiceRow = typeof Service.$inferSelect;

export interface ServiceCreateInput {
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: boolean;
}

export interface ServiceUpdateInput {
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: boolean;
}

class ServiceModel {
  async findAll(): Promise<ServiceRow[]> {
    const rows = await db
      .select()
      .from(Service)
      .orderBy(desc(Service.serviceID));
    return rows;
  }

  async findById(id: number): Promise<ServiceRow | undefined> {
    const rows = await db
      .select()
      .from(Service)
      .where(eq(Service.serviceID, id))
      .limit(1);

    return rows[0];
  }

  async create(input: ServiceCreateInput): Promise<ServiceRow> {
    // Insert the new row
    await db.insert(Service).values({
      name: input.name,
      imagePath: input.imagePath,
      duration: input.duration,
      price: input.price,
      isBooked: input.isBooked,
    });

    // Fetch the created row by unique name (UNIQUE(name))
    const rows = await db
      .select()
      .from(Service)
      .where(eq(Service.name, input.name))
      .orderBy(desc(Service.serviceID))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to load created service');
    }

    return rows[0];
  }

  async update(id: number, input: ServiceUpdateInput): Promise<void> {
    await db
      .update(Service)
      .set({
        name: input.name,
        imagePath: input.imagePath,
        duration: input.duration,
        price: input.price,
        isBooked: input.isBooked,
      })
      .where(eq(Service.serviceID, id));
  }

  async delete(id: number): Promise<void> {
    // 1) delete dependent AppointmentService rows to avoid FK errors
    await db
      .delete(AppointmentService)
      .where(eq(AppointmentService.serviceID, id));

    // 2) delete the Service row
    await db.delete(Service).where(eq(Service.serviceID, id));
  }
}

export const serviceModel = new ServiceModel();