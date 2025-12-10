import api from '@/services/api';

export interface BarberShopDto {
  barberShopID?: number;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  street?: string | null;
  postalCode?: string | null;
  description?: string | null;
}

class AdminBarberShopApi {
  private baseUrl = '/barber-shops';

  /**
   * Get first barber shop (or null if none exists).
   * Backend returns an array from GET /api/barber-shops.
   */
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

/**
 * Used by BarberShop.vue on load.
 * Returns existing shop or null (so UI can show empty form).
 */
export async function fetchBarberShop(): Promise<BarberShopDto | null> {
  return adminBarberShopApi.get();
}

/**
 * Used by BarberShop.vue on save.
 * If barberShopID exists -> PUT
 * else -> POST (create new shop)
 */
export async function updateBarberShop(payload: BarberShopDto): Promise<void> {
  const { barberShopID, ...rest } = payload;

  if (barberShopID && barberShopID > 0) {
    await adminBarberShopApi.update(barberShopID, rest);
  } else {
    await adminBarberShopApi.create(rest);
  }
}
