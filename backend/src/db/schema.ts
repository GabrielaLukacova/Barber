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

// PostalCode
export const PostalCode = pgTable('postalcode', {
  postalCode: varchar('postalCode', { length: 4 }).primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
});

// BarberShop
export const BarberShop = pgTable('barbershop', {
  barberShopID: integer('barberShopID').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 15 }),
  email: varchar('email', { length: 100 }),
  street: varchar('street', { length: 100 }),
  postalCode: varchar('postalCode', { length: 4 }).references(() => PostalCode.postalCode),
  description: text('description'),
});

// GalleryImage
export const GalleryImage = pgTable('galleryimage', {
  imageID: integer('imageID').generatedAlwaysAsIdentity().primaryKey(),
  barberShopID: integer('barberShopID')
    .notNull()
    .references(() => BarberShop.barberShopID),
  filePath: text('filePath').notNull(),
  sortOrder: integer('sortOrder').default(0),
});

// Client
export const Client = pgTable('client', {
  clientID: integer('clientID').generatedAlwaysAsIdentity().primaryKey(),
  firstName: varchar('firstName', { length: 15 }).notNull(),
  lastName: varchar('lastName', { length: 15 }).notNull(),
  email: varchar('email', { length: 50 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 15 }),
  note: text('note'),
});

// Service
export const Service = pgTable('service', {
  serviceID: integer('serviceID').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  imagePath: text('imagePath'),
  duration: integer('duration').notNull(),
  price: integer('price').notNull(),
  isBooked: boolean('isBooked').notNull().default(false),
});

export type ServiceRow = typeof Service.$inferSelect;
export type NewServiceRow = typeof Service.$inferInsert;

// OpeningHours
export const OpeningHours = pgTable('openinghours', {
  openingHoursID: integer('openingHoursID').generatedAlwaysAsIdentity().primaryKey(),
  dayOfWeek: varchar('dayOfWeek', { length: 10 }).notNull(),
  openingTime: time('openingTime'),
  closingTime: time('closingTime'),
});

// TimeOff
export const TimeOff = pgTable('timeoff', {
  timeOffID: integer('timeOffID').generatedAlwaysAsIdentity().primaryKey(),
  start: timestamp('start', { mode: 'string' }).notNull(),
  end: timestamp('end', { mode: 'string' }).notNull(),
  reason: text('reason'),
});

// Appointment
export const Appointment = pgTable('appointment', {
  appointmentID: integer('appointmentID').generatedAlwaysAsIdentity().primaryKey(),
  clientID: integer('clientID').references(() => Client.clientID),
  appointmentDate: date('appointmentDate', { mode: 'string' }).notNull(),
  startTime: time('startTime').notNull(),
  endTime: time('endTime').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('BOOKED'),
  totalPriceCents: integer('totalPriceCents'),
});

// AppointmentService (composite PK)
export const AppointmentService = pgTable(
  'appointmentservice',
  {
    appointmentID: integer('appointmentID')
      .notNull()
      .references(() => Appointment.appointmentID, { onDelete: 'cascade' }),
    serviceID: integer('serviceID')
      .notNull()
      .references(() => Service.serviceID),
    price: integer('price').notNull(),
    duration: integer('duration').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.appointmentID, t.serviceID] }),
  }),
);