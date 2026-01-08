export type Service = {
  id: string;
  name: string;
  durationMin: number;
  priceCents: number;
  active: boolean;
};

export type Barber = {
  id: string;
  displayName: string;
  color: string;
};

export type AvailabilityResponse = {
  slots: string[];
  durationMin: number;
};

export type AppointmentInput = {
  serviceId: string;
  barberId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  start: string; 
  end: string; 
};