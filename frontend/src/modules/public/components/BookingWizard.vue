<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useServicesStore } from '@/modules/public/stores/services';
import { useBookingStore } from '@/modules/public/stores/booking';
import { fetchAvailableSlots, publicBook } from '@/modules/public/services/bookingApi';

const servicesStore = useServicesStore();
const booking = useBookingStore();

const todayISO = new Date().toISOString().slice(0, 10);

const slots = ref<string[]>([]);
const durationMin = ref<number>(0);
const loadingSlots = ref(false);
const submitting = ref(false);
const errorMsg = ref<string | null>(null);

onMounted(async () => {
  await servicesStore.load();
});

const selectedServiceIDs = computed(() =>
  (booking.services ?? []).map((s: any) => s.id).filter(Boolean),
);

const totalPriceDKK = computed(() =>
  (booking.services ?? []).reduce((sum: number, s: any) => sum + ((s.priceCents ?? 0) / 100), 0),
);

function toggleService(svc: any) {
  const list = booking.services ?? [];
  const exists = list.some((x: any) => x.id === svc.id);
  booking.services = exists ? list.filter((x: any) => x.id !== svc.id) : [...list, svc];
}

function resetTimeSelection() {
  booking.slot = null as any;
  slots.value = [];
  durationMin.value = 0;
}

async function loadSlots() {
  errorMsg.value = null;
  slots.value = [];
  durationMin.value = 0;

  if (!booking.dateISO || selectedServiceIDs.value.length === 0) return;

  loadingSlots.value = true;
  try {
    const data = await fetchAvailableSlots({
      date: booking.dateISO,
      serviceIDs: selectedServiceIDs.value as number[],
    });
    slots.value = data.slots;
    durationMin.value = data.durationMin;
    if (!slots.value.includes(booking.slot as any)) booking.slot = null as any;
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.error ?? 'Could not load available slots';
  } finally {
    loadingSlots.value = false;
  }
}

watch(() => selectedServiceIDs.value.join(','), () => {
  resetTimeSelection();
  if (booking.step >= 2) loadSlots();
});

watch(() => booking.dateISO, () => {
  resetTimeSelection();
  if (booking.step >= 2) loadSlots();
});

const canNext = computed(() => {
  if (booking.step === 1) return selectedServiceIDs.value.length > 0;
  if (booking.step === 2) return !!booking.dateISO && !!booking.slot;
  if (booking.step === 3) return !!booking.customerName && (!!booking.customerEmail || !!booking.customerPhone);
  return true;
});

async function submit() {
  if (!booking.dateISO || !booking.slot || selectedServiceIDs.value.length === 0) return;
  submitting.value = true;
  errorMsg.value = null;

  try {
    await publicBook({
      serviceIDs: selectedServiceIDs.value as number[],
      date: booking.dateISO,
      startTime: booking.slot as any,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail || undefined,
      customerPhone: booking.customerPhone || undefined,
    });
    booking.step = 4;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 409) {
      errorMsg.value = e?.response?.data?.error ?? 'This slot was just booked. Please pick another time.';
      await loadSlots();
      booking.step = 2;
      return;
    }
    const details = e?.response?.data?.details;
    errorMsg.value =
      (Array.isArray(details) && details.length ? details.join(' • ') : null) ||
      e?.response?.data?.error ||
      'Could not create booking';
  } finally {
    submitting.value = false;
  }
}

function goNext() {
  if (booking.step === 1) {
    booking.step = 2;
    loadSlots();
    return;
  }
  booking.step++;
}
</script>

<template>
  <div class="card p-6 space-y-6">
    <div class="flex items-center gap-3 text-sm">
      <span :class="['px-2 py-1 rounded', booking.step>=1 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">1</span> Services
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=2 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">2</span> Date & time
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=3 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">3</span> Details
      <div class="h-px bg-zinc-200 flex-1"></div>
      <span :class="['px-2 py-1 rounded', booking.step>=4 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">4</span> Done
    </div>

    <div v-if="errorMsg" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMsg }}
    </div>

    <!-- Step 1 -->
    <div v-if="booking.step === 1" class="space-y-3">
      <div class="text-sm text-slate-600">Choose one or more services.</div>

      <div class="grid md:grid-cols-2 gap-3">
        <button
          v-for="s in servicesStore.items"
          :key="s.id"
          type="button"
          @click="toggleService(s)"
          :class="[
            'text-left p-4 rounded-xl border transition',
            (booking.services ?? []).some((x:any)=>x.id===s.id)
              ? 'border-brand.beige bg-brand.gray'
              : 'border-zinc-200 hover:bg-zinc-50'
          ]"
        >
          <div class="font-medium text-slate-900">{{ s.name }}</div>
          <div class="text-sm text-slate-600 mt-1">{{ s.durationMin }} min • {{ (s.priceCents/100).toFixed(0) }} DKK</div>
        </button>
      </div>

      <div v-if="(booking.services ?? []).length" class="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
        <div><span class="font-medium">Selected:</span> {{ (booking.services ?? []).map((s:any)=>s.name).join(', ') }}</div>
        <div class="mt-1"><span class="font-medium">Estimated total:</span> {{ totalPriceDKK.toFixed(0) }} DKK</div>
      </div>
    </div>

    <!-- Step 2 -->
    <div v-else-if="booking.step === 2" class="space-y-4">
      <div class="grid md:grid-cols-2 gap-3">
        <div class="card p-4">
          <div class="font-medium mb-2">Pick date</div>
          <input
            class="w-full rounded-xl border border-zinc-300 p-2"
            type="date"
            :min="todayISO"
            v-model="booking.dateISO"
          />
          <div class="text-xs text-zinc-500 mt-2" v-if="durationMin">Total duration: {{ durationMin }} min</div>
        </div>

        <div class="card p-4">
          <div class="font-medium mb-2">Time slots</div>

          <div v-if="!booking.dateISO" class="text-sm text-zinc-500">
            Choose a date to see available times.
          </div>

          <div v-else-if="loadingSlots" class="space-y-2">
            <div class="h-9 rounded-xl bg-zinc-100 animate-pulse"></div>
            <div class="h-9 rounded-xl bg-zinc-100 animate-pulse"></div>
            <div class="h-9 rounded-xl bg-zinc-100 animate-pulse"></div>
          </div>

          <div v-else class="flex flex-wrap gap-2">
            <button
              v-for="t in slots"
              :key="t"
              type="button"
              class="btn"
              :class="booking.slot===t ? 'btn-primary' : 'btn-ghost'"
              @click="booking.slot = t"
            >{{ t }}</button>

            <div v-if="booking.dateISO && slots.length===0" class="text-sm text-zinc-500">
              No slots available for this date. Try another day.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3 -->
    <div v-else-if="booking.step === 3" class="grid md:grid-cols-2 gap-4">
      <div class="md:col-span-2 text-sm text-slate-600">
        Provide at least email or phone so we can reach you.
      </div>

      <div>
        <label class="block text-sm mb-1">Name</label>
        <input v-model="booking.customerName" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>

      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="booking.customerEmail" type="email" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm mb-1">Phone</label>
        <input v-model="booking.customerPhone" class="w-full rounded-xl border border-zinc-300 p-2" />
      </div>

      <div class="md:col-span-2 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
        <div><span class="font-medium">Date:</span> {{ booking.dateISO }}</div>
        <div><span class="font-medium">Time:</span> {{ booking.slot }}</div>
        <div class="mt-2"><span class="font-medium">Services:</span> {{ (booking.services ?? []).map((s:any)=>s.name).join(', ') }}</div>
        <div class="mt-1"><span class="font-medium">Estimated total:</span> {{ totalPriceDKK.toFixed(0) }} DKK</div>
      </div>
    </div>

    <!-- Step 4 -->
    <div v-else-if="booking.step === 4" class="text-center py-10">
      <h3 class="text-2xl font-semibold">Booking confirmed 🎉</h3>
      <p class="text-zinc-600 mt-2">We’ll contact you if anything changes.</p>
      <button class="btn btn-ghost mt-6" type="button" @click="booking.reset()">Book another</button>
    </div>

    <div class="flex items-center justify-between pt-2">
      <button class="btn btn-ghost" type="button" :disabled="booking.step===1 || submitting" @click="booking.step = Math.max(1, booking.step - 1)">
        Back
      </button>

      <div class="flex items-center gap-2">
        <button v-if="booking.step<3" type="button" class="btn btn-primary" :disabled="!canNext" @click="goNext()">
          Next
        </button>
        <button v-else-if="booking.step===3" type="button" class="btn btn-primary" :disabled="!canNext || submitting" @click="submit()">
          {{ submitting ? 'Submitting…' : 'Confirm booking' }}
        </button>
      </div>
    </div>
  </div>
</template>
