// Public-facing types used in BookingWizard, stores, etc.

export interface Service {
  id: number;                 // UI id
  name: string;
  durationMin: number;        // in minutes
  priceCents: number;         // in øre
  imagePath: string | null;
}

export interface Barber {
  id: number;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface AvailabilityResponse {
  slots: string[];       // e.g. ["09:00", "09:30"]
  durationMin: number;   // duration of the service in minutes
}

export interface AppointmentInput {
  serviceId: number;
  barberId?: number;
  // these are not always passed by BookingWizard, so keep them optional
  date?: string;          // "YYYY-MM-DD"
  time?: string;          // "HH:MM"
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  note?: string;
  start?: string;        // ISO start datetime
  end?: string;          // ISO end datetime
}
