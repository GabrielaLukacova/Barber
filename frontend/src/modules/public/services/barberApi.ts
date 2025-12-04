import { api } from './api';
import type { Service, Barber, AvailabilityResponse, AppointmentInput } from '@/types';

export async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>('/services');
  return data;
}

export async function fetchBarbers(): Promise<Barber[]> {
  const { data } = await api.get<Barber[]>('/barbers');
  return data;
}

export async function fetchAvailability(params: { serviceId: string; barberId?: string; date?: string; }): Promise<AvailabilityResponse> {
  const { data } = await api.get<AvailabilityResponse>('/availability', { params });
  return data;
}

export async function createAppointment(payload: AppointmentInput) {
  const { data } = await api.post('/appointments', payload);
  return data;
}