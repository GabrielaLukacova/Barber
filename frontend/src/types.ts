export interface Service {
  id: number; 
  name: string;
  durationMin: number; // in minutes
  priceCents: number; 
  imagePath: string | null;
}

export interface Barber {
  id: number;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export interface AvailabilityResponse {
  slots: string[]; 
  durationMin: number; // duration of the service in minutes
}

export interface AppointmentInput {
  serviceId: number;
  barberId?: number;
  date?: string; 
  time?: string; 
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  note?: string;
  start?: string; 
  end?: string; 
}