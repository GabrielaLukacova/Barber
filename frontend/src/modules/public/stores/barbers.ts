import { defineStore } from 'pinia';
import type { Barber } from '@/types';
import { fetchBarbers } from '@/services/barberApi';

export const useBarbersStore = defineStore('barbers', {
  state: () => ({
    items: [] as Barber[],
    loading: false as boolean,
  }),
  actions: {
    async load() {
      if (this.items.length) return;
      this.loading = true;
      try {
        this.items = await fetchBarbers();
      } finally {
        this.loading = false;
      }
    },
  },
});