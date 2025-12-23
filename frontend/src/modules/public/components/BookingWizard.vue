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
  if (!booking.services) booking.services = [];
});

const selectedServiceIDs = computed(() =>
  (booking.services ?? []).map((s: any) => s.id).filter(Boolean),
);

const totalPriceDKK = computed(() =>
  (booking.services ?? []).reduce((sum: number, s: any) => sum + ((s.priceCents ?? 0) / 100), 0),
);

function isSelected(id: number) {
  return (booking.services ?? []).some((x: any) => x.id === id);
}

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
      errorMsg.value = e?.response?.data?.error ?? 'That time was just taken. Please choose another slot.';
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

function goBack() {
  booking.step = Math.max(1, booking.step - 1);
}

function fmtPriceDKK(cents: number) {
  return `${Math.round(cents / 100)} DKK`;
}
</script>

<template>
  <div class="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
    <!-- Main card -->
    <div class="card p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-slate-500">Online booking</div>
          <h3 class="text-2xl font-semibold text-slate-900">Reserve your time</h3>
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-600">
          <span :class="['px-2 py-1 rounded', booking.step>=1 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">1</span>
          <span :class="['px-2 py-1 rounded', booking.step>=2 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">2</span>
          <span :class="['px-2 py-1 rounded', booking.step>=3 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">3</span>
          <span :class="['px-2 py-1 rounded', booking.step>=4 ? 'bg-brand.beige text-brand.black' : 'bg-zinc-200']">4</span>
        </div>
      </div>

      <div v-if="errorMsg" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ errorMsg }}
      </div>

      <!-- Step 1 -->
      <div v-if="booking.step === 1" class="space-y-3">
        <div class="text-sm text-slate-600">Select one or more services.</div>

        <div class="grid md:grid-cols-2 gap-3">
          <button
            v-for="s in servicesStore.items"
            :key="s.id"
            type="button"
            @click="toggleService(s)"
            :class="[
              'text-left p-4 rounded-2xl border transition',
              isSelected(s.id) ? 'border-brand.beige bg-brand.gray' : 'border-zinc-200 hover:bg-zinc-50'
            ]"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="font-medium text-slate-900">{{ s.name }}</div>
                <div class="text-sm text-slate-600 mt-1">{{ s.durationMin }} min</div>
              </div>
              <div class="text-sm font-medium text-slate-900 whitespace-nowrap">
                {{ fmtPriceDKK(s.priceCents) }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-else-if="booking.step === 2" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-3">
          <div class="card p-4">
            <div class="font-medium mb-2">Pick a date</div>
            <input
              class="w-full rounded-xl border border-zinc-300 p-2"
              type="date"
              :min="todayISO"
              v-model="booking.dateISO"
            />
            <div class="text-xs text-zinc-500 mt-2" v-if="durationMin">Total duration: {{ durationMin }} min</div>
          </div>

          <div class="card p-4">
            <div class="font-medium mb-2">Choose a time</div>

            <div v-if="!booking.dateISO" class="text-sm text-zinc-500">
              Choose a date to see available times.
            </div>

            <div v-else-if="loadingSlots" class="space-y-2">
              <div class="h-10 rounded-xl bg-zinc-100 animate-pulse"></div>
              <div class="h-10 rounded-xl bg-zinc-100 animate-pulse"></div>
              <div class="h-10 rounded-xl bg-zinc-100 animate-pulse"></div>
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
      <div v-else-if="booking.step === 3" class="space-y-4">
        <div class="text-sm text-slate-600">Enter your details (email or phone required).</div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm mb-1">Name</label>
            <input v-model="booking.customerName" class="w-full rounded-xl border border-zinc-300 p-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input v-model="booking.customerEmail" type="email" class="w-full rounded-xl border border-zinc-300 p-2" />
          </div>
          <div>
            <label class="block text-sm mb-1">Phone</label>
            <input v-model="booking.customerPhone" class="w-full rounded-xl border border-zinc-300 p-2" />
          </div>
        </div>
      </div>

      <!-- Step 4 -->
      <div v-else-if="booking.step === 4" class="text-center py-10">
        <h3 class="text-2xl font-semibold">Booking confirmed 🎉</h3>
        <p class="text-zinc-600 mt-2">Thanks! We’ll contact you if anything changes.</p>
        <button class="btn btn-ghost mt-6" type="button" @click="booking.reset()">Book another</button>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-between pt-2">
        <button class="btn btn-ghost" type="button" :disabled="booking.step===1 || submitting" @click="goBack()">
          Back
        </button>

        <div class="flex items-center gap-2">
          <button v-if="booking.step<3" type="button" class="btn btn-primary" :disabled="!canNext" @click="goNext()">
            Continue
          </button>
          <button v-else-if="booking.step===3" type="button" class="btn btn-primary" :disabled="!canNext || submitting" @click="submit()">
            {{ submitting ? 'Booking…' : 'Confirm booking' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Summary card -->
    <div class="card p-6 space-y-4">
      <div class="font-semibold text-slate-900">Summary</div>

      <div class="text-sm text-slate-700">
        <div class="text-slate-500 mb-1">Services</div>
        <div v-if="(booking.services ?? []).length === 0" class="text-slate-500">No services selected</div>
        <ul v-else class="space-y-1">
          <li v-for="s in (booking.services ?? [])" :key="s.id" class="flex items-center justify-between gap-3">
            <span class="truncate">{{ s.name }}</span>
            <span class="text-slate-500 whitespace-nowrap">{{ fmtPriceDKK(s.priceCents) }}</span>
          </li>
        </ul>
      </div>

      <div class="h-px bg-zinc-200"></div>

      <div class="text-sm text-slate-700 space-y-1">
        <div class="flex justify-between gap-3">
          <span class="text-slate-500">Date</span>
          <span class="text-slate-900">{{ booking.dateISO || '—' }}</span>
        </div>
        <div class="flex justify-between gap-3">
          <span class="text-slate-500">Time</span>
          <span class="text-slate-900">{{ booking.slot || '—' }}</span>
        </div>
        <div class="flex justify-between gap-3">
          <span class="text-slate-500">Duration</span>
          <span class="text-slate-900">{{ durationMin ? durationMin + ' min' : '—' }}</span>
        </div>
      </div>

      <div class="h-px bg-zinc-200"></div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-slate-500">Estimated total</span>
        <span class="text-lg font-semibold text-slate-900">{{ totalPriceDKK.toFixed(0) }} DKK</span>
      </div>
    </div>
  </div>
</template>
