<template>
  <section
    id="opening-hours"
    class="mx-auto max-w-6xl px-4 py-12 flex justify-center"
  >
    <div class="w-full max-w-2xl text-center space-y-6">
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
        Opening hours
      </h2>

      <p class="text-sm text-zinc-600 max-w-md mx-auto">
        Plan your visit or book online whenever it suits you. We keep it simple:
        clear hours and sharp cuts.
      </p>

      <div v-if="loading" class="mt-4 text-sm text-zinc-500">
        Loading opening hours…
      </div>

      <div
        v-else
        class="mt-4 rounded-3xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-50 px-6 py-3 flex items-center justify-center gap-3 text-xs sm:text-sm"
        >
          <span class="uppercase tracking-[0.18em] text-zinc-400">
            Shop schedule
          </span>
          <span class="h-px w-10 bg-zinc-600 hidden sm:inline-block"></span>
          <span class="text-zinc-200">
            Today: <strong>{{ todayLabel }}</strong>
          </span>
        </div>

        <div class="divide-y divide-zinc-100">
          <div
            v-for="row in orderedOpeningHours"
            :key="row.dayOfWeek"
            :class="[
              'px-6 py-3 flex items-center justify-between text-sm',
              isToday(row.dayOfWeek)
                ? 'bg-zinc-50/80'
                : 'bg-white'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="w-24 text-sm font-medium text-zinc-800">
                {{ row.dayOfWeek }}
              </span>
              <span
                v-if="isToday(row.dayOfWeek)"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-900"
              >
                Today
              </span>
            </div>

            <div class="text-sm font-medium tabular-nums">
              <span v-if="row.openingTime && row.closingTime" class="text-zinc-900">
                {{ formatTime(row.openingTime) }} – {{ formatTime(row.closingTime) }}
              </span>
              <span v-else class="text-zinc-400">
                Closed
              </span>
            </div>
          </div>

          <div class="px-6 py-3 text-[11px] text-zinc-500 text-center bg-zinc-50">
            Hours may vary on holidays and special occasions. Always check your booking.
          </div>
        </div>
      </div>

      <a
        href="#booking"
        class="inline-flex items-center rounded-full bg-zinc-900 text-zinc-50 px-4 py-2 text-sm font-semibold hover:bg-zinc-800 transition-colors"
      >
        Book now
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

interface OpeningHoursDto {
  openingHoursID: number;
  dayOfWeek: string;
  openingTime: string | null;
  closingTime: string | null;
}

const rows = ref<OpeningHoursDto[]>([]);
const loading = ref(false);
const todayName = ref<string | null>(null);

const weekdayOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const orderedOpeningHours = computed(() => {
  return [...rows.value].sort(
    (a, b) =>
      weekdayOrder.indexOf(a.dayOfWeek) - weekdayOrder.indexOf(b.dayOfWeek),
  );
});

function isToday(dayOfWeek: string): boolean {
  return todayName.value === dayOfWeek;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

const todayLabel = computed(() => {
  if (!todayName.value) return '—';
  const row = rows.value.find((r) => r.dayOfWeek === todayName.value);
  if (!row) return todayName.value;
  if (row.openingTime && row.closingTime) {
    return `${todayName.value} · ${formatTime(row.openingTime)} – ${formatTime(
      row.closingTime,
    )}`;
  }
  return `${todayName.value} · Closed`;
});

async function loadOpeningHours() {
  const apiBase = import.meta.env.VITE_API_URL;
  const res = await axios.get<OpeningHoursDto[]>(`${apiBase}/api/opening-hours`);
  rows.value = res.data ?? [];
}

onMounted(() => {
  const now = new Date();
  const intl = new Intl.DateTimeFormat('en-GB', { weekday: 'long' });
  todayName.value = intl.format(now);

  loading.value = true;
  loadOpeningHours()
    .catch((err) => {
      console.error('Failed to load opening hours:', err);
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
