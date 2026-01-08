<template>
  <div id="opening-hours" class="w-full">
    <p class="text-[14px] uppercase tracking-[0.18em] text-zinc-400 text-center">Opening hours</p>

    <div v-if="loading" class="mt-6 text-sm text-zinc-300 text-center">Loading…</div>

    <div v-else class="mt-8">
      <div class="border-t border-white/10">
        <div
          v-for="row in orderedOpeningHours"
          :key="row.dayOfWeek"
          :class="[
            'relative py-4 flex items-center justify-between gap-8 border-b border-white/10',
            isToday(row.dayOfWeek) ? 'bg-white/[0.06]' : '',
          ]"
        >
          <!-- Today accent -->
          <span v-if="isToday(row.dayOfWeek)" class="absolute" aria-hidden="true" />

          <div class="min-w-0 flex items-center gap-3">
            <span
              :class="[
                'text-sm sm:text-base font-semibold tracking-tight',
                isToday(row.dayOfWeek) ? 'text-zinc-50' : 'text-zinc-200',
              ]"
            >
              {{ row.dayOfWeek }}
            </span>

            <span
              v-if="isToday(row.dayOfWeek)"
              class="text-[10px] uppercase tracking-[0.18em] text-[#C7A47D]"
            >
              Today
            </span>
          </div>

          <div class="text-right tabular-nums">
            <span
              v-if="row.openingTime && row.closingTime"
              :class="[
                'text-sm sm:text-base font-semibold',
                isToday(row.dayOfWeek) ? 'text-zinc-50' : 'text-zinc-100',
              ]"
            >
              {{ formatTime(row.openingTime) }} – {{ formatTime(row.closingTime) }}
            </span>
            <span
              v-else
              :class="[
                'text-sm sm:text-base font-semibold',
                isToday(row.dayOfWeek) ? 'text-zinc-300' : 'text-zinc-500',
              ]"
            >
              Closed
            </span>
          </div>
        </div>
      </div>

      <div
        class="mt-8 h-px w-full bg-gradient-to-r from-transparent via-[#C7A47D]/55 to-transparent"
      ></div>
    </div>
  </div>
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

const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const orderedOpeningHours = computed(() => {
  return [...rows.value].sort(
    (a, b) => weekdayOrder.indexOf(a.dayOfWeek) - weekdayOrder.indexOf(b.dayOfWeek),
  );
});

function isToday(dayOfWeek: string): boolean {
  return todayName.value === dayOfWeek;
}

function formatTime(time: string): string {
  return time.slice(0, 5);
}

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
    .catch((err) => console.error('Failed to load opening hours:', err))
    .finally(() => {
      loading.value = false;
    });
});
</script>