// DATA TYPES
export interface ServiceDto {
  serviceID: number;
  name: string;
  imagePath: string | null;  // returned from backend
  duration: number;
  price: number;
  isBooked: boolean;
}

export interface CreateServicePayload {
  name: string;
  duration: number;
  price: number;
  isBooked?: boolean;
  imageFile?: File | null;    // only file, not path
}

export interface UpdateServicePayload extends CreateServicePayload {
  serviceID: number;
}

export type Service = ServiceDto;
export type ServicePayload = CreateServicePayload;


// AUTH HEADERS
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}


// API CLIENT
export class AdminServiceApi {
  private baseUrl = '/api/services';

  async getAll(): Promise<ServiceDto[]> {
    const res = await fetch(this.baseUrl, {
      headers: { ...getAuthHeaders() },
    });

    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  }

  async getById(id: number): Promise<ServiceDto> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      headers: { ...getAuthHeaders() },
    });

    if (!res.ok) throw new Error('Failed to load service');
    return res.json();
  }


  // CREATE SERVICE
  async create(payload: CreateServicePayload): Promise<void> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('duration', String(payload.duration));
    formData.append('price', String(payload.price));
    formData.append('isBooked', payload.isBooked ? '1' : '0');

    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to create service');
    }
  }


  // UPDATE SERVICE
  async update(payload: UpdateServicePayload): Promise<void> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('duration', String(payload.duration));
    formData.append('price', String(payload.price));
    formData.append('isBooked', payload.isBooked ? '1' : '0');

    if (payload.imageFile) {
      formData.append('image', payload.imageFile);
    }

    const res = await fetch(`${this.baseUrl}/${payload.serviceID}`, {
      method: 'PUT',
      headers: { ...getAuthHeaders() },
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to update service');
    }
  }


  // DELETE SERVICE
  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete service');
    }
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

export async function updateService(
  id: number,
  payload: ServicePayload,
): Promise<void> {
  const fullPayload: UpdateServicePayload = { ...payload, serviceID: id };
  return adminServiceApi.update(fullPayload);
}

export async function deleteService(id: number): Promise<void> {
  return adminServiceApi.delete(id);
}
