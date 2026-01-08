import api from '@/shared/api/api';

export interface OpeningHoursDto {
  openingHoursID: number;
  dayOfWeek: string;
  openingTime: string | null;
  closingTime: string | null;
}

export interface OpeningHoursUpdatePayload {
  dayOfWeek: string;
  openingTime: string | null;
  closingTime: string | null;
}

export class AdminOpeningHoursApi {
  private baseUrl = '/opening-hours';

  async getAll(): Promise<OpeningHoursDto[]> {
    const res = await api.get<OpeningHoursDto[]>(this.baseUrl);
    return res.data;
  }

  async update(id: number, payload: OpeningHoursUpdatePayload): Promise<void> {
    await api.put(this.baseUrl + '/' + id, payload);
  }
}

export const adminOpeningHoursApi = new AdminOpeningHoursApi();

export async function fetchOpeningHours(): Promise<OpeningHoursDto[]> {
  return adminOpeningHoursApi.getAll();
}

export async function updateOpeningHour(
  row: OpeningHoursDto,
  openingTime: string | null,
  closingTime: string | null,
): Promise<void> {
  const payload: OpeningHoursUpdatePayload = {
    dayOfWeek: row.dayOfWeek,
    openingTime,
    closingTime,
  };
  return adminOpeningHoursApi.update(row.openingHoursID, payload);
}