import { db, schema } from '../db/db';
import { eq } from 'drizzle-orm';

export const serviceService = {
  async listServices() {
    return db.select().from(schema.Service);
  },

  async getService(id: number) {
    const [service] = await db
      .select()
      .from(schema.Service)
      .where(eq(schema.Service.serviceID, id));

    return service ?? null;
  },

  async createService(data: {
    name: string;
    duration: number;
    price: number;
    isBooked: boolean;
    imagePath: string | null;
  }) {
    const [created] = await db
      .insert(schema.Service)
      .values(data)
      .returning();

    return created;
  },

  async updateService(
    id: number,
    data: {
      name?: string;
      duration?: number;
      price?: number;
      isBooked?: boolean;
      imagePath?: string | null;
    },
  ) {
    await db
      .update(schema.Service)
      .set(data)
      .where(eq(schema.Service.serviceID, id));
  },

  async deleteService(id: number) {
    await db
      .delete(schema.Service)
      .where(eq(schema.Service.serviceID, id));
  },
};