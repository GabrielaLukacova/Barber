import { defineStore } from 'pinia';
import type { Service } from '@/types';
import { fetchServices } from '@/shared/api/barberApi';

export const useServicesStore = defineStore('services', {
  state: () => ({
    items: [] as Service[],
    loading: false as boolean,
  }),
  actions: {
    async load() {
      if (this.items.length) return;
      this.loading = true;
      try {
        this.items = await fetchServices();
      } finally {
        this.loading = false;
      }
    },
  },
});