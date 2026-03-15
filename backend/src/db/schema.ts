import {
  pgTable,
  integer,
  varchar,
  boolean,
  text,
  time,
  date,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';

/* =========================
   POSTAL CODE
========================= */

export const PostalCode = pgTable('postalcode', {
  postalCode: varchar('postalcode', { length: 4 }).primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
});

/* =========================
   BARBER SHOP
========================= */

export const BarberShop = pgTable('barbershop', {
  barberShopID: integer('barbershopid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phoneNumber: varchar('phonenumber', { length: 15 }),
  email: varchar('email', { length: 100 }),
  street: varchar('street', { length: 100 }),
  postalCode: varchar('postalcode', { length: 4 }).references(
    () => PostalCode.postalCode
  ),
  description: text('description'),
});

/* =========================
   GALLERY IMAGE
========================= */

export const GalleryImage = pgTable('galleryimage', {
  imageID: integer('imageid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  barberShopID: integer('barbershopid')
    .notNull()
    .references(() => BarberShop.barberShopID, { onDelete: 'cascade' }),
  filePath: text('filepath').notNull(),
  sortOrder: integer('sortorder').default(0),
});

/* =========================
   CLIENT
========================= */

export const Client = pgTable('client', {
  clientID: integer('clientid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  firstName: varchar('firstname', { length: 15 }).notNull(),
  lastName: varchar('lastname', { length: 15 }).notNull(),
  email: varchar('email', { length: 50 }).notNull(),
  phoneNumber: varchar('phonenumber', { length: 15 }),
  note: text('note'),
});

/* =========================
   SERVICE
========================= */

export const Service = pgTable('service', {
  serviceID: integer('serviceid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  imagePath: text('imagepath'),
  duration: integer('duration').notNull(),
  price: integer('price').notNull(),
  isBooked: boolean('isbooked').notNull().default(false),
});

export type ServiceRow = typeof Service.$inferSelect;
export type NewServiceRow = typeof Service.$inferInsert;

/* =========================
   OPENING HOURS
========================= */

export const OpeningHours = pgTable('openinghours', {
  openingHoursID: integer('openinghoursid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  dayOfWeek: varchar('dayofweek', { length: 10 }).notNull(),
  openingTime: time('openingtime'),
  closingTime: time('closingtime'),
});

/* =========================
   TIME OFF
========================= */

export const TimeOff = pgTable('timeoff', {
  timeOffID: integer('timeoffid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  start: timestamp('start', { mode: 'string' }).notNull(),
  end: timestamp('end', { mode: 'string' }).notNull(),
  reason: text('reason'),
});

/* =========================
   APPOINTMENT
========================= */

export const Appointment = pgTable('appointment', {
  appointmentID: integer('appointmentid')
    .generatedAlwaysAsIdentity()
    .primaryKey(),
  clientID: integer('clientid').references(() => Client.clientID, {
    onDelete: 'set null',
  }),
  appointmentDate: date('appointmentdate', { mode: 'string' }).notNull(),
  startTime: time('starttime').notNull(),
  endTime: time('endtime').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('BOOKED'),
  totalPriceCents: integer('totalpricecents'),
});

/* =========================
   APPOINTMENT SERVICE
========================= */

export const AppointmentService = pgTable(
  'appointmentservice',
  {
    appointmentID: integer('appointmentid')
      .notNull()
      .references(() => Appointment.appointmentID, {
        onDelete: 'cascade',
      }),

    // 🔥 THIS IS THE IMPORTANT FIX
    serviceID: integer('serviceid')
      .notNull()
      .references(() => Service.serviceID, {
        onDelete: 'cascade', // ← THIS FIXES YOUR DELETE PROBLEM
      }),

    price: integer('price').notNull(),
    duration: integer('duration').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.appointmentID, t.serviceID] }),
  }),
);