import { defineStore } from 'pinia';

type State = {
  step: number; // 1..4
  service?: Service;
  barber?: Barber;
  dateISO?: string; // YYYY-MM-DD
  slot?: string; // "HH:mm"
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
};

export const useBookingStore = defineStore('booking', {
  state: (): State => ({
    step: 1,
    customerName: '',
    customerEmail: '',
  }),
  actions: {
    reset() {
      this.step = 1;
      this.service = undefined;
      this.barber = undefined;
      this.dateISO = undefined;
      this.slot = undefined;
      this.customerName = '';
      this.customerEmail = '';
      this.customerPhone = undefined;
    },
  },
});
