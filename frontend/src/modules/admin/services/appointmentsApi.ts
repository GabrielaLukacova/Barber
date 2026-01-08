import api from '@/shared/api/api';

export type AdminAppointmentRow = {
  appointmentID: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPriceCents: number | null;
  clientID: number | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  services: Array<{ serviceID: number; name: string; duration: number; price: number }>;
};

export async function fetchAppointmentsWithDetails(): Promise<AdminAppointmentRow[]> {
  const { data } = await api.get('/appointments/with-details');
  return (data ?? []) as AdminAppointmentRow[];
}

export async function updateAppointmentStatus(
  id: number,
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED',
) {
  const { data } = await api.put(`/appointments/${id}`, { status });
  return data;
}

export async function deleteAppointment(id: number) {
  const { data } = await api.delete(`/appointments/${id}`);
  return data;
}