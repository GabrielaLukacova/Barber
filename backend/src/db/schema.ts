import {
  mysqlTable,
  int,
  varchar,
  boolean,
  text,
  time,
  date,
  datetime,
  primaryKey,
} from 'drizzle-orm/mysql-core';

// PostalCode
export const PostalCode = mysqlTable('PostalCode', {
  postalCode: varchar('postalCode', { length: 4 }).primaryKey(),
  city: varchar('city', { length: 100 }).notNull(),
});

// BarberShop
export const BarberShop = mysqlTable('BarberShop', {
  barberShopID: int('barberShopID').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 15 }),
  email: varchar('email', { length: 100 }),
  street: varchar('street', { length: 100 }),
  postalCode: varchar('postalCode', { length: 4 }).references(() => PostalCode.postalCode),
  description: text('description'),
});

// GalleryImage
export const GalleryImage = mysqlTable('GalleryImage', {
  imageID: int('imageID').autoincrement().primaryKey(),
  barberShopID: int('barberShopID')
    .notNull()
    .references(() => BarberShop.barberShopID),
  filePath: text('filePath').notNull(),
  altText: text('altText').notNull(),
  title: text('title'),
  description: text('description'),
  sortOrder: int('sortOrder').default(0),
});

// Client
export const Client = mysqlTable('Client', {
  clientID: int('clientID').autoincrement().primaryKey(),
  firstName: varchar('firstName', { length: 15 }).notNull(),
  lastName: varchar('lastName', { length: 15 }).notNull(),
  email: varchar('email', { length: 50 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 15 }),
  note: text('note'),
});

// Service
export const Service = mysqlTable('Service', {
  serviceID: int('serviceID').autoincrement().primaryKey(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  imagePath: text('imagePath'),
  duration: int('duration').notNull(),
  price: int('price').notNull(),
  isBooked: boolean('isBooked').notNull().default(false),
});

export type ServiceRow = typeof Service.$inferSelect;
export type NewServiceRow = typeof Service.$inferInsert;

// OpeningHours
export const OpeningHours = mysqlTable('OpeningHours', {
  openingHoursID: int('openingHoursID').autoincrement().primaryKey(),
  dayOfWeek: varchar('dayOfWeek', { length: 10 }).notNull(),
  openingTime: time('openingTime'),
  closingTime: time('closingTime'),
});

// TimeOff
export const TimeOff = mysqlTable('TimeOff', {
  timeOffID: int('timeOffID').autoincrement().primaryKey(),
  start: datetime('start', { mode: 'string' }).notNull(),
  end: datetime('end', { mode: 'string' }).notNull(),
  reason: text('reason'),
});

// Appointment
export const Appointment = mysqlTable('Appointment', {
  appointmentID: int('appointmentID').autoincrement().primaryKey(),
  clientID: int('clientID').references(() => Client.clientID),
  appointmentDate: date('appointmentDate', { mode: 'string' }).notNull(),
  startTime: time('startTime').notNull(),
  endTime: time('endTime').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('BOOKED'),
  totalPriceCents: int('totalPriceCents'),
});

// AppointmentService (composite PK)
export const AppointmentService = mysqlTable(
  'AppointmentService',
  {
    appointmentID: int('appointmentID')
      .notNull()
      .references(() => Appointment.appointmentID, { onDelete: 'cascade' }),
    serviceID: int('serviceID')
      .notNull()
      .references(() => Service.serviceID),
    price: int('price').notNull(),
    duration: int('duration').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.appointmentID, t.serviceID] }),
  }),
);
