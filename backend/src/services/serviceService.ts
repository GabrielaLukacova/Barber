// backend/src/services/serviceService.ts
import { serviceModel, type ServiceRow } from '../models/serviceModel';

export interface ServiceInput {
  name: string;
  duration: number;
  price: number;
  isBooked?: boolean;
  imagePath?: string | null;
}

export class ServiceService {
  async listServices(): Promise<ServiceRow[]> {
    return serviceModel.findAll();
  }

  async getService(id: number): Promise<ServiceRow | undefined> {
    return serviceModel.findById(id);
  }

  async createService(input: ServiceInput): Promise<ServiceRow> {
    return serviceModel.create({
      name: input.name,
      duration: input.duration,
      price: input.price,
      isBooked: input.isBooked ?? false,
      imagePath: input.imagePath ?? null,
    });
  }

  async updateService(id: number, input: ServiceInput): Promise<void> {
    await serviceModel.update(id, {
      name: input.name,
      duration: input.duration,
      price: input.price,
      isBooked: input.isBooked ?? false,
      imagePath: input.imagePath ?? null,
    });
  }

  async deleteService(id: number): Promise<void> {
    await serviceModel.delete(id);
  }
}

export const serviceService = new ServiceService();
