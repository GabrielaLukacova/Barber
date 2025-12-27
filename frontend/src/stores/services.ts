import { defineStore } from 'pinia';
import api from '@/services/api';

export interface PublicService {
  serviceID: number;
  name: string;
  duration: number;
  price: number;
  imagePath: string | null;
  isBooked: boolean;
}

export const useServicesStore = defineStore('public-services', {
  state: () => ({
    services: [] as PublicService[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadServices() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get('/services');
        this.services = res.data;
      } catch (_err: any) {
        this.error = 'Failed to load services';
      } finally {
        this.loading = false;
      }
    },
  },
});
