<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import closedImg from "@/assets/barber-closed.jpg";

type TimeOffRow = {
  timeOffID: number;
  start: string;
  end: string;
  reason: string | null;
};

const items = ref<TimeOffRow[]>([]);
const loading = ref(false);

const backendBase =
  (import.meta.env.VITE_API_URL as string) ||
  "https://barber-backend-b77j.onrender.com";

const hasItems = computed(() => items.value.length > 0);

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function fmtTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatLabel(startIso: string, endIso: string) {
  const s = new Date(startIso);
  const e = new Date(endIso);

  const sameDay = s.toDateString() === e.toDateString();
  const startTime = fmtTime(s);
  const endTime = fmtTime(e);

  const startIsMidnight = startTime === "00:00";
  const endIsEod = endTime === "23:59" || endTime === "23:58";

  if (sameDay && startIsMidnight && endIsEod)
    return `${fmtDate(s)} — closed`;

  if (!sameDay && startIsMidnight && endIsEod)
    return `${fmtDate(s)} → ${fmtDate(e)}`;

  if (sameDay)
    return `${fmtDate(s)} · ${startTime}–${endTime}`;

  return `${fmtDate(s)} ${startTime} → ${fmtDate(e)} ${endTime}`;
}

async function load() {
  loading.value = true;
  try {
    const res = await fetch(`${backendBase}/api/time-off`);
    if (!res.ok) {
      items.value = [];
      return;
    }
    const data = (await res.json()) as TimeOffRow[];
    items.value = Array.isArray(data) ? data : [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section v-if="hasItems" class="section-block">
    <div
      class="rounded-2xl overflow-hidden bg-[#0b0e12]
             shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
    >
      <!-- Left flexible, right fixed but bigger -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_700px]">
        <!-- LEFT -->
        <div class="p-6 sm:p-8">
          <p class="text-xs uppercase tracking-[0.22em] text-[#C7A47D]/80">
            Special hours
          </p>

          <p class="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#C7A47D]/85 max-w-prose">
            Closed on the dates below — even barbers need a break.
            We’ll be back before your hair gets too long.
          </p>

          <div class="mt-6 space-y-3">
            <div
              v-for="t in items"
              :key="t.timeOffID"
              class="rounded-xl bg-black/25 ring-1 ring-[#C7A47D]/15 px-5 py-3"
            >
              <p class="text-sm font-semibold text-[#C7A47D]">
                {{ formatLabel(t.start, t.end) }}
              </p>

              <p v-if="t.reason" class="mt-1 text-sm italic text-[#C7A47D]/70">
                {{ t.reason }}
              </p>
            </div>
          </div>

          <p v-if="loading" class="mt-4 text-xs text-[#C7A47D]/60">
            Updating…
          </p>
        </div>

        <!-- RIGHT IMAGE: bigger, no padding, fully visible -->
        <div class="relative hidden lg:flex items-center justify-center bg-black/30">
          <img
            :src="closedImg"
            alt="Barber shop closed"
            class="w-full max-h-[3000px] object-contain"
          />
          <div
            class="absolute inset-0 bg-gradient-to-l
                   from-black/10 via-black/30 to-[#0b0e12]"
          ></div>
        </div>
      </div>

      <!-- subtle accent -->
      <div class="h-[2px] bg-gradient-to-r from-transparent via-[#C7A47D]/30 to-transparent"></div>
    </div>
  </section>
</template>
