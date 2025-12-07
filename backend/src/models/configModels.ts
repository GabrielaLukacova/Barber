import { db, schema } from '../db/db';
import { asc, desc, eq } from 'drizzle-orm';

const {
  OpeningHours,
  TimeOff,
  BarberShop,
  GalleryImage,
  PostalCode,
} = schema;

export type OpeningHoursRow = typeof OpeningHours.$inferSelect;
export type TimeOffRow = typeof TimeOff.$inferSelect;
export type BarberShopRow = typeof BarberShop.$inferSelect;
export type GalleryImageRow = typeof GalleryImage.$inferSelect;
export type PostalCodeRow = typeof PostalCode.$inferSelect;

// OpeningHours
export interface OpeningHoursInput {
  dayOfWeek: string;
  openingTime?: string | null;
  closingTime?: string | null;
}

// TimeOff
export interface TimeOffInput {
  start: string;
  end: string;
  reason?: string | null;
}

// BarberShop
export interface BarberShopInput {
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  street?: string | null;
  postalCode?: string | null;
  description?: string | null;
}

// GalleryImage
export interface GalleryImageInput {
  barberShopID: number;
  filePath: string;
  altText: string;
  title?: string | null;
  description?: string | null;
  sortOrder?: number;
}

// PostalCode
export interface PostalCodeInput {
  postalCode: string;
  city: string;
}

export class ConfigModels {
  // --- OpeningHours ---
  async listOpeningHours(): Promise<OpeningHoursRow[]> {
    return db
      .select()
      .from(OpeningHours)
      .orderBy(asc(OpeningHours.dayOfWeek));
  }

  async getOpeningHours(id: number): Promise<OpeningHoursRow | undefined> {
    const rows = await db
      .select()
      .from(OpeningHours)
      .where(eq(OpeningHours.openingHoursID, id))
      .limit(1);
    return rows[0];
  }

  async createOpeningHours(input: OpeningHoursInput): Promise<OpeningHoursRow> {
    const result = await db.insert(OpeningHours).values({
      dayOfWeek: input.dayOfWeek,
      openingTime: input.openingTime ?? null,
      closingTime: input.closingTime ?? null,
    });

    const insertId = Number((result as any).insertId);
    const rows = await db
      .select()
      .from(OpeningHours)
      .where(eq(OpeningHours.openingHoursID, insertId))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to fetch created OpeningHours row');
    }

    return rows[0];
  }

  async updateOpeningHours(id: number, input: OpeningHoursInput): Promise<void> {
    await db
      .update(OpeningHours)
      .set({
        dayOfWeek: input.dayOfWeek,
        openingTime: input.openingTime ?? null,
        closingTime: input.closingTime ?? null,
      })
      .where(eq(OpeningHours.openingHoursID, id));
  }

  async deleteOpeningHours(id: number): Promise<void> {
    await db.delete(OpeningHours).where(eq(OpeningHours.openingHoursID, id));
  }

  // --- TimeOff ---
  async listTimeOff(): Promise<TimeOffRow[]> {
    return db.select().from(TimeOff).orderBy(desc(TimeOff.start));
  }

  async getTimeOff(id: number): Promise<TimeOffRow | undefined> {
    const rows = await db
      .select()
      .from(TimeOff)
      .where(eq(TimeOff.timeOffID, id))
      .limit(1);
    return rows[0];
  }

  async createTimeOff(input: TimeOffInput): Promise<TimeOffRow> {
    const result = await db.insert(TimeOff).values({
      start: input.start,
      end: input.end,
      reason: input.reason ?? null,
    });

    const insertId = Number((result as any).insertId);
    const rows = await db
      .select()
      .from(TimeOff)
      .where(eq(TimeOff.timeOffID, insertId))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to fetch created TimeOff row');
    }

    return rows[0];
  }

  async updateTimeOff(id: number, input: TimeOffInput): Promise<void> {
    await db
      .update(TimeOff)
      .set({
        start: input.start,
        end: input.end,
        reason: input.reason ?? null,
      })
      .where(eq(TimeOff.timeOffID, id));
  }

  async deleteTimeOff(id: number): Promise<void> {
    await db.delete(TimeOff).where(eq(TimeOff.timeOffID, id));
  }

  // --- BarberShop ---
  async listBarberShops(): Promise<BarberShopRow[]> {
    return db.select().from(BarberShop).orderBy(asc(BarberShop.barberShopID));
  }

  async getBarberShop(id: number): Promise<BarberShopRow | undefined> {
    const rows = await db
      .select()
      .from(BarberShop)
      .where(eq(BarberShop.barberShopID, id))
      .limit(1);
    return rows[0];
  }

  async createBarberShop(input: BarberShopInput): Promise<BarberShopRow> {
    const result = await db.insert(BarberShop).values({
      name: input.name,
      phoneNumber: input.phoneNumber ?? null,
      email: input.email ?? null,
      street: input.street ?? null,
      postalCode: input.postalCode ?? null,
      description: input.description ?? null,
    });

    const insertId = Number((result as any).insertId);
    const rows = await db
      .select()
      .from(BarberShop)
      .where(eq(BarberShop.barberShopID, insertId))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to fetch created BarberShop row');
    }

    return rows[0];
  }

  async updateBarberShop(id: number, input: BarberShopInput): Promise<void> {
    await db
      .update(BarberShop)
      .set({
        name: input.name,
        phoneNumber: input.phoneNumber ?? null,
        email: input.email ?? null,
        street: input.street ?? null,
        postalCode: input.postalCode ?? null,
        description: input.description ?? null,
      })
      .where(eq(BarberShop.barberShopID, id));
  }

  async deleteBarberShop(id: number): Promise<void> {
    await db.delete(BarberShop).where(eq(BarberShop.barberShopID, id));
  }

  // --- GalleryImage ---
  async listGalleryImages(): Promise<GalleryImageRow[]> {
    return db
      .select()
      .from(GalleryImage)
      .orderBy(asc(GalleryImage.sortOrder), asc(GalleryImage.imageID));
  }

  async getGalleryImage(id: number): Promise<GalleryImageRow | undefined> {
    const rows = await db
      .select()
      .from(GalleryImage)
      .where(eq(GalleryImage.imageID, id))
      .limit(1);
    return rows[0];
  }

  async createGalleryImage(input: GalleryImageInput): Promise<GalleryImageRow> {
    const result = await db.insert(GalleryImage).values({
      barberShopID: input.barberShopID,
      filePath: input.filePath,
      altText: input.altText,
      title: input.title ?? null,
      description: input.description ?? null,
      sortOrder: input.sortOrder ?? 0,
    });

    const insertId = Number((result as any).insertId);
    const rows = await db
      .select()
      .from(GalleryImage)
      .where(eq(GalleryImage.imageID, insertId))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to fetch created GalleryImage row');
    }

    return rows[0];
  }

  async updateGalleryImage(id: number, input: GalleryImageInput): Promise<void> {
    await db
      .update(GalleryImage)
      .set({
        barberShopID: input.barberShopID,
        filePath: input.filePath,
        altText: input.altText,
        title: input.title ?? null,
        description: input.description ?? null,
        sortOrder: input.sortOrder ?? 0,
      })
      .where(eq(GalleryImage.imageID, id));
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(GalleryImage).where(eq(GalleryImage.imageID, id));
  }

  // --- PostalCode ---
  async listPostalCodes(): Promise<PostalCodeRow[]> {
    return db.select().from(PostalCode).orderBy(asc(PostalCode.postalCode));
  }

  async getPostalCode(code: string): Promise<PostalCodeRow | undefined> {
    const rows = await db
      .select()
      .from(PostalCode)
      .where(eq(PostalCode.postalCode, code))
      .limit(1);
    return rows[0];
  }

  async createPostalCode(input: PostalCodeInput): Promise<PostalCodeRow> {
    await db.insert(PostalCode).values({
      postalCode: input.postalCode,
      city: input.city,
    });

    const rows = await db
      .select()
      .from(PostalCode)
      .where(eq(PostalCode.postalCode, input.postalCode))
      .limit(1);

    if (!rows[0]) {
      throw new Error('Failed to fetch created PostalCode row');
    }

    return rows[0];
  }

  async updatePostalCode(code: string, input: PostalCodeInput): Promise<void> {
    await db
      .update(PostalCode)
      .set({
        city: input.city,
      })
      .where(eq(PostalCode.postalCode, code));
  }

  async deletePostalCode(code: string): Promise<void> {
    await db.delete(PostalCode).where(eq(PostalCode.postalCode, code));
  }
}

export const configModels = new ConfigModels();
