import { defineStore } from 'pinia';
import {
  adminServiceApi,
  type ServiceDto,
  type CreateServicePayload,
  type UpdateServicePayload,
} from '../services/serviceApi';

interface State {
  items: ServiceDto[];
  loading: boolean;
  error: string | null;
  selectedService: ServiceDto | null;
}

export const useServiceStore = defineStore('admin-services', {
  state: (): State => ({
    items: [],
    loading: false,
    error: null,
    selectedService: null,
  }),
  actions: {
    async load() {
      if (this.items.length) return;
      this.loading = true;
      this.error = null;
      try {
        this.items = await adminServiceApi.getAll();
      } catch (e) {
        console.error(e);
        this.error = 'Failed to load services.';
      } finally {
        this.loading = false;
      }
    },

    async create(payload: CreateServicePayload) {
      this.error = null;
      await adminServiceApi.create(payload);
      this.items = await adminServiceApi.getAll();
    },

    async update(payload: UpdateServicePayload) {
      this.error = null;
      await adminServiceApi.update(payload);
      this.items = await adminServiceApi.getAll();
    },

    async remove(id: number) {
      this.error = null;
      await adminServiceApi.delete(id);
      this.items = this.items.filter((s) => s.serviceID !== id);
    },

    // ---- used by AdminServiceEdit.vue ----
    async fetchServiceById(id: number) {
      this.error = null;
      try {
        this.selectedService = await adminServiceApi.getById(id);
      } catch (e) {
        console.error(e);
        this.error = 'Failed to load service.';
        this.selectedService = null;
      }
    },

    async updateService(payload: UpdateServicePayload) {
      this.error = null;
      await adminServiceApi.update(payload);
      this.selectedService = await adminServiceApi.getById(payload.serviceID);
      this.items = await adminServiceApi.getAll();
    },
  },
});
