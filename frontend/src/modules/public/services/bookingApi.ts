import { api } from './api';

const BARBER_SHOP_ID = 4;

export async function fetchAvailableSlots(params: { date: string; serviceIDs: number[] }) {
  const { data } = await api.get('/public/available-slots', {
    params: { date: params.date, serviceIDs: params.serviceIDs.join(',') },
  });
  return {
    slots: (data?.slots ?? []) as string[],
    durationMin: (data?.durationMin ?? 0) as number,
  };
}

export async function publicBook(payload: {
  serviceIDs: number[];
  date: string;
  startTime: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}) {
  const { data } = await api.post('/public/book', { barberShopID: BARBER_SHOP_ID, ...payload });
  return data;
}