import api from '@/services/api';

export interface BarberShopDto {
  barberShopID?: number;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  street?: string | null;
  postalCode?: string | null;
  city?: string | null;
  description?: string | null;
}

class AdminBarberShopApi {
  private baseUrl = '/barber-shops';

  async get(): Promise<BarberShopDto | null> {
    const res = await api.get<BarberShopDto[]>(this.baseUrl);
    const list = res.data || [];
    return list[0] ?? null;
  }

  async create(payload: BarberShopDto): Promise<void> {
    await api.post(this.baseUrl, payload);
  }

  async update(id: number, payload: BarberShopDto): Promise<void> {
    await api.put(`${this.baseUrl}/${id}`, payload);
  }
}

export const adminBarberShopApi = new AdminBarberShopApi();

export async function fetchBarberShop(): Promise<BarberShopDto | null> {
  return adminBarberShopApi.get();
}

export async function updateBarberShop(payload: BarberShopDto): Promise<void> {
  const { barberShopID, ...rest } = payload;

  if (barberShopID && barberShopID > 0) {
    await adminBarberShopApi.update(barberShopID, rest);
  } else {
    await adminBarberShopApi.create(rest);
  }
}
