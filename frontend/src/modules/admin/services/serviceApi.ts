import api from '@/services/api';

// DATA TYPES
export interface ServiceDto {
  serviceID: number;
  name: string;
  imagePath: string | null; // returned from backend
  duration: number;
  price: number;
  isBooked: boolean;
}

export interface CreateServicePayload {
  name: string;
  duration: number;
  price: number;
  isBooked?: boolean;
  imageFile?: File | null; // only file, not path
}

export interface UpdateServicePayload extends CreateServicePayload {
  serviceID: number;
}

export type Service = ServiceDto;
export type ServicePayload = CreateServicePayload;

// API CLIENT USING AXIOS + VITE_API_URL
export class AdminServiceApi {
  private baseUrl = '/services'; // api.ts adds /api prefix

  async getAll(): Promise<ServiceDto[]> {
    const res = await api.get<ServiceDto[]>(this.baseUrl);
    return res.data;
  }

  async getById(id: number): Promise<ServiceDto> {
    const res = await api.get<ServiceDto>(this.baseUrl + '/' + id);
    return res.data;
  }

  async create(payload: CreateServicePayload): Promise<void> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('duration', String(payload.duration));
    formData.append('price', String(payload.price));
    formData.append('isBooked', payload.isBooked ? '1' : '0');

    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }

    await api.post(this.baseUrl, formData);
  }

  async update(payload: UpdateServicePayload): Promise<void> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('duration', String(payload.duration));
    formData.append('price', String(payload.price));
    formData.append('isBooked', payload.isBooked ? '1' : '0');

    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }

    await api.put(this.baseUrl + '/' + payload.serviceID, formData);
  }

  async delete(id: number): Promise<void> {
    await api.delete(this.baseUrl + '/' + id);
  }
}

// EXPORT HELPER FUNCTIONS
export const adminServiceApi = new AdminServiceApi();

export async function fetchServices(): Promise<Service[]> {
  return adminServiceApi.getAll();
}

export async function fetchService(id: number): Promise<Service> {
  return adminServiceApi.getById(id);
}

export async function createService(payload: ServicePayload): Promise<void> {
  return adminServiceApi.create(payload);
}

export async function updateService(id: number, payload: ServicePayload): Promise<void> {
  const fullPayload: UpdateServicePayload = { ...payload, serviceID: id };
  return adminServiceApi.update(fullPayload);
}

export async function deleteService(id: number): Promise<void> {
  return adminServiceApi.delete(id);
}
