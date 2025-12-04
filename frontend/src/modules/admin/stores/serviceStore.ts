import { defineStore } from 'pinia';
import { adminServiceApi, ServiceDto, CreateServicePayload, UpdateServicePayload } from '../services/serviceApi';

interface ServiceState {
  services: ServiceDto[];
  selectedService: ServiceDto | null;
  loading: boolean;
  error: string | null;
}

export const useServiceStore = defineStore('admin-services', {
  state: (): ServiceState => ({
    services: [],
    selectedService: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchServices() {
      this.loading = true;
      this.error = null;
      try {
        this.services = await adminServiceApi.getAll();
      } catch (err: any) {
        this.error = err.message || 'Failed to load services';
      } finally {
        this.loading = false;
      }
    },

    async fetchServiceById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        this.selectedService = await adminServiceApi.getById(id);
      } catch (err: any) {
        this.error = err.message || 'Failed to load service';
        this.selectedService = null;
      } finally {
        this.loading = false;
      }
    },

    async createService(payload: CreateServicePayload) {
      this.loading = true;
      this.error = null;
      try {
        await adminServiceApi.create(payload);
        await this.fetchServices();
      } catch (err: any) {
        this.error = err.message || 'Failed to create service';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateService(payload: UpdateServicePayload) {
      this.loading = true;
      this.error = null;
      try {
        await adminServiceApi.update(payload);
        await this.fetchServices();
      } catch (err: any) {
        this.error = err.message || 'Failed to update service';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteService(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await adminServiceApi.delete(id);
        this.services = this.services.filter((s) => s.serviceID !== id);
      } catch (err: any) {
        this.error = err.message || 'Failed to delete service';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
