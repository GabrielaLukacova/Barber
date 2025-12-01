import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// SERVICES
export const services = sqliteTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  durationMin: integer("duration_min").notNull(),
  priceCents: integer("price_cents").notNull(),
  // use integer as boolean (0/1) internally
  active: integer("active").notNull().default(1),
});

// BARBERS
export const barbers = sqliteTable("barbers", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  color: text("color").notNull().default("#C7A47D"),
});

// APPOINTMENTS
export const appointments = sqliteTable("appointments", {
  id: text("id").primaryKey(),
  serviceId: text("service_id")
    .notNull()
    .references(() => services.id),
  barberId: text("barber_id")
    .notNull()
    .references(() => barbers.id),

  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),

  start: integer("start").notNull(), // ms since epoch
  end: integer("end").notNull(),

  status: text("status")
    .notNull()
    .default("BOOKED"),

  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});
