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
export const postalcode = pgTable('postalcode', {
  postalcode: varchar('postalcode', { length: 4 }).primaryKey(),
  city: varchar('city', { length: 50 }).notNull(),
});

// BarberShop
export const barbershop = pgTable('barbershop', {
  barbershopid: integer('barbershopid').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phonenumber: varchar('phonenumber', { length: 15 }),
  email: varchar('email', { length: 100 }),
  street: varchar('street', { length: 100 }),
  postalcode: varchar('postalcode', { length: 4 }).references(() => postalcode.postalcode),
  description: text('description'),
});

// Client
export const client = pgTable('client', {
  clientid: integer('clientid').generatedAlwaysAsIdentity().primaryKey(),
  firstname: varchar('firstname', { length: 15 }).notNull(),
  lastname: varchar('lastname', { length: 15 }).notNull(),
  email: varchar('email', { length: 50 }).notNull(),
  phonenumber: varchar('phonenumber', { length: 15 }),
  note: text('note'),
});

// Service
export const service = pgTable('service', {
  serviceid: integer('serviceid').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 30 }).notNull().unique(),
  imagepath: text('imagepath'),
  duration: integer('duration').notNull(),
  price: integer('price').notNull(),
  isbooked: boolean('isbooked').notNull().default(false),
});

// OpeningHours
export const openinghours = pgTable('openinghours', {
  openinghoursid: integer('openinghoursid').generatedAlwaysAsIdentity().primaryKey(),
  dayofweek: varchar('dayofweek', { length: 10 }).notNull(),
  openingtime: time('openingtime'),
  closingtime: time('closingtime'),
});

// TimeOff
export const timeoff = pgTable('timeoff', {
  timeoffid: integer('timeoffid').generatedAlwaysAsIdentity().primaryKey(),
  start: timestamp('start', { mode: 'string' }).notNull(),
  end: timestamp('end', { mode: 'string' }).notNull(),
  reason: text('reason'),
});

// Appointment
export const appointment = pgTable('appointment', {
  appointmentid: integer('appointmentid').generatedAlwaysAsIdentity().primaryKey(),
  clientid: integer('clientid').references(() => client.clientid),
  appointmentdate: date('appointmentdate', { mode: 'string' }).notNull(),
  starttime: time('starttime').notNull(),
  endtime: time('endtime').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('BOOKED'),
  totalpricecents: integer('totalpricecents'),
});

// AppointmentService
export const appointmentservice = pgTable(
  'appointmentservice',
  {
    appointmentid: integer('appointmentid')
      .notNull()
      .references(() => appointment.appointmentid, { onDelete: 'cascade' }),
    serviceid: integer('serviceid')
      .notNull()
      .references(() => service.serviceid),
    price: integer('price').notNull(),
    duration: integer('duration').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.appointmentid, t.serviceid] }),
  }),
);