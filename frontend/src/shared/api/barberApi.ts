import api from './api';
import type { Service, Barber, AvailabilityResponse, AppointmentInput } from '@/types';

// /services -> map backend DTO to public Service type
export async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get<any[]>('/services');
  return data.map((row: any) => ({
    id: row.serviceID ?? row.id,
    name: row.name,
    durationMin: row.duration ?? row.durationMin ?? 0,
    priceCents:
      typeof row.priceCents === 'number'
        ? row.priceCents
        : typeof row.price === 'number'
          ? row.price * 100
          : 0,
    imagePath: row.imagePath ?? null,
  }));
}

// /barbers -> map to simple Barber type (best-effort)
export async function fetchBarbers(): Promise<Barber[]> {
  const { data } = await api.get<any[]>('/barbers');
  return data.map((row: any) => ({
    id: row.barberID ?? row.id,
    displayName: row.displayName ?? row.name ?? 'Barber',
    avatarUrl: row.avatarUrl ?? null,
    bio: row.bio ?? null,
  }));
}

// Allow numeric or string IDs here
export async function fetchAvailability(params: {
  serviceId: string | number;
  barberId?: string | number;
  date?: string;
}): Promise<AvailabilityResponse> {
  const { data } = await api.get<any>('/availability', { params });
  return {
    slots: data.slots ?? [],
    durationMin: data.durationMin ?? 0,
  };
}

export async function createAppointment(payload: AppointmentInput) {
  const { data } = await api.post('/appointments', payload);
  return data;
}
