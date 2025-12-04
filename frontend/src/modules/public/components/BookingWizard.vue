<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useServicesStore } from '@/modules/public/stores/services';
import { useBarbersStore } from '@/modules/public/stores/barbers';
import { useBookingStore } from '@/modules/public/stores/booking';
import { fetchAvailability, createAppointment } from '@/modules/public/services/barberApi';

const servicesStore = useServicesStore();
const barbersStore = useBarbersStore();
const booking = useBookingStore();

const slots = ref<string[]>([]);
const durationMin = ref<number>(30);
const submitting = ref(false);
const todayISO = new Date().toISOString().slice(0, 10);

onMounted(async () => {
  await Promise.all([servicesStore.load(), barbersStore.load()]);
});

async function loadAvailability() {
  if (!booking.service) return;
  const data = await fetchAvailability({ serviceId: booking.service.id, barberId: booking.barber?.id, date: booking.dateISO });
  slots.value = data.slots;
  durationMin.value = data.durationMin;
}

const canNext = computed(() => {
  if (booking.step === 1) return !!booking.service;
  if (booking.step === 2) return !!booking.barber && !!booking.dateISO && !!booking.slot;
  if (booking.step === 3) return !!booking.customerName && !!booking.customerEmail;
  return true;
});

async function submit() {
  if (!booking.service || !booking.barber || !booking.dateISO || !booking.slot) return;
  submitting.value = true;
  try {
    const start = new Date(`${booking.dateISO}T${booking.slot}:00`);
    const end = new Date(start.getTime() + durationMin.value * 60_000);
    await createAppointment({
      serviceId: booking.service.id,
      barberId: booking.barber.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      start: start.toISOString(),
      end: end.toISOString(),
    });
    booking.step = 4;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="card p-6 space-y-6">
    <!-- Stepper -->
    <div class="flex items-center gap-3 text-sm">
      <span :class="['px-2 py-1 rounded', booking.step>=1 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">1</span> Service
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=2 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">2</span> Time
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=3 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">3</span> Details
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=4 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">4</span> Done
    </div>

    <!-- Step 1: Service -->
    <div v-if="booking.step === 1" class="space-y-3">
      <div class="grid md:grid-cols-2 gap-3">
        <ServiceCard
          v-for="s in servicesStore.items"
          :key="s.id"
          :service="s"
          :onSelect="(svc: any)=>{ booking.service = svc; booking.step = 2; }"
        />
      </div>
    </div>

    <!-- Step 2: Barber + Date + Slot -->
    <div v-else-if="booking.step === 2" class="space-y-4">
      <div class="grid md:grid-cols-3 gap-3">
        <div class="card p-4">
          <div class="font-medium mb-2">Choose barber</div>
          <ul class="space-y-2">
            <li
              v-for="b in barbersStore.items"
              :key="b.id"
              @click="booking.barber = b; loadAvailability();"
              :class="['p-3 rounded-xl cursor-pointer border', booking.barber?.id===b.id ? 'border-brand.beige bg-brand.gray' : 'border-zinc-200 hover:bg-zinc-50']"
            >
              {{ b.displayName }}
            </li>
          </ul>
        </div>
        <div class="card p-4">
          <div class="font-medium mb-2">Pick date</div>
          <input
            class="w-full rounded-xl border border-zinc-300 p-2"
            type="date"
            :min="todayISO"
            v-model="booking.dateISO"
            @change="loadAvailability()"
          />
        </div>
        <div class="card p-4">
          <div class="font-medium mb-2">Time slots</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in slots"
              :key="t"
              class="btn"
              :class="booking.slot===t ? 'btn-primary' : 'btn-ghost'"
              @click="booking.slot = t"
            >{{ t }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Customer details -->
    <div v-else-if="booking.step === 3" class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1">Name</label>
        <input v-model="booking.customerName" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="booking.customerEmail" type="email" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm mb-1">Phone (optional)</label>
        <input v-model="booking.customerPhone" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>
    </div>

    <!-- Step 4: Done -->
    <div v-else-if="booking.step === 4" class="text-center py-10">
      <h3 class="text-2xl font-semibold">Booking confirmed 🎉</h3>
      <p class="text-zinc-600 mt-2">We’ve sent a confirmation to your email.</p>
      <button class="btn btn-ghost mt-6" @click="booking.reset()">Book another</button>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between pt-2">
      <button class="btn btn-ghost" :disabled="booking.step===1" @click="booking.step = Math.max(1, booking.step - 1)">Back</button>
      <div class="flex items-center gap-2">
        <button v-if="booking.step<3" class="btn btn-primary" :disabled="!canNext" @click="booking.step++">Next</button>
        <button v-else-if="booking.step===3" class="btn btn-primary" :disabled="!canNext || submitting" @click="submit()">
          {{ submitting ? 'Submitting…' : 'Confirm booking' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ServiceCard from './ServiceCard.vue';
export default { components: { ServiceCard } };
</script>