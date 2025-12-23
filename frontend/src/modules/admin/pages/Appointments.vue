<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchAppointmentsWithDetails, updateAppointmentStatus, type AdminAppointmentRow } from '@/modules/admin/services/appointmentsApi';

const items = ref<AdminAppointmentRow[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const q = ref('');
const statusFilter = ref<'BOOKED' | 'CANCELLED' | 'COMPLETED'>('BOOKED');

function toISODateTime(dateISO: string, timeHHMMSS: string) {
  const hhmm = (timeHHMMSS ?? '').slice(0, 5);
  return new Date(`${dateISO}T${hhmm}:00`);
}

function isPast(a: AdminAppointmentRow) {
  if (!a.appointmentDate || !a.endTime) return false;
  return toISODateTime(a.appointmentDate, a.endTime).getTime() < Date.now();
}

function effectiveStatus(a: AdminAppointmentRow) {
  if (a.status === 'BOOKED' && isPast(a)) return 'COMPLETED';
  return a.status;
}

const sorted = computed(() => {
  return [...items.value].sort((a, b) => {
    const ad = toISODateTime(a.appointmentDate, a.startTime).getTime();
    const bd = toISODateTime(b.appointmentDate, b.startTime).getTime();
    return ad - bd; // earliest -> latest
  });
});

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();

  return sorted.value.filter((a) => {
    if (effectiveStatus(a) !== statusFilter.value) return false;
    if (!query) return true;

    const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim().toLowerCase();
    const email = (a.email ?? '').toLowerCase();
    const phone = (a.phoneNumber ?? '').toLowerCase();
    const services = (a.services ?? []).map((s) => (s?.name ?? '').toLowerCase()).join(' ');
    const date = (a.appointmentDate ?? '').toLowerCase();

    return [name, email, phone, services, date].some((x) => x.includes(query));
  });
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    items.value = await fetchAppointmentsWithDetails();
  } catch (e: any) {
    error.value = e?.response?.data?.error ?? 'Failed to load appointments';
  } finally {
    loading.value = false;
  }
}

async function cancel(a: AdminAppointmentRow) {
  try {
    await updateAppointmentStatus(a.appointmentID, 'CANCELLED');
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.error ?? 'Failed to cancel appointment';
  }
}

function fmtTime(t: string) {
  return (t ?? '').slice(0, 5);
}

function fmtPrice(cents: number | null) {
  if (typeof cents !== 'number') return '—';
  return `${Math.round(cents / 100)} DKK`;
}

function servicesText(a: AdminAppointmentRow) {
  const list = a.services ?? [];
  if (!list.length) return '—';
  return list.map((s) => s.name).join(', ');
}

function totalDuration(a: AdminAppointmentRow) {
  const list = a.services ?? [];
  const min = list.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  return min ? `${min} min` : '—';
}

function fullName(a: AdminAppointmentRow) {
  const name = [a.firstName, a.lastName].filter(Boolean).join(' ').trim();
  return name || 'Guest';
}

function contactText(a: AdminAppointmentRow) {
  const parts = [a.email, a.phoneNumber].filter(Boolean);
  return parts.length ? parts.join(' • ') : '—';
}

onMounted(load);
</script>

<template>
  <div class="p-8 bg-slate-50 min-h-screen text-slate-900">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Appointments</h1>
        <p class="text-slate-600">Booked (upcoming) shown by default. Past bookings appear under Completed.</p>
      </div>

      <div class="flex flex-wrap gap-3">
        <input
          v-model="q"
          class="w-full md:w-80 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Search name, email, phone, service, date…"
        />
        <select
          v-model="statusFilter"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </div>

    <div v-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="text-left px-4 py-3 font-semibold">Date</th>
            <th class="text-left px-4 py-3 font-semibold">Time</th>
            <th class="text-left px-4 py-3 font-semibold">Client</th>
            <th class="text-left px-4 py-3 font-semibold">Contact</th>
            <th class="text-left px-4 py-3 font-semibold">Services</th>
            <th class="text-left px-4 py-3 font-semibold">Duration</th>
            <th class="text-left px-4 py-3 font-semibold">Total</th>
            <th class="text-left px-4 py-3 font-semibold">Status</th>
            <th class="text-right px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-200">
          <tr v-if="loading">
            <td colspan="9" class="px-4 py-6 text-slate-600">Loading…</td>
          </tr>

          <tr v-else-if="filtered.length === 0">
            <td colspan="9" class="px-4 py-6 text-slate-600">No appointments found.</td>
          </tr>

          <tr v-else v-for="a in filtered" :key="a.appointmentID" class="hover:bg-slate-50">
            <td class="px-4 py-3 whitespace-nowrap">{{ a.appointmentDate }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ fmtTime(a.startTime) }}–{{ fmtTime(a.endTime) }}</td>

            <td class="px-4 py-3">
              <div class="font-medium text-slate-900">{{ fullName(a) }}</div>
              <div class="text-xs text-slate-500">#{{ a.appointmentID }}</div>
            </td>

            <td class="px-4 py-3 text-slate-700">{{ contactText(a) }}</td>

            <td class="px-4 py-3 text-slate-700 max-w-[320px]">
              <div class="truncate" :title="servicesText(a)">{{ servicesText(a) }}</div>
            </td>

            <td class="px-4 py-3 whitespace-nowrap text-slate-700">{{ totalDuration(a) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-slate-700">{{ fmtPrice(a.totalPriceCents) }}</td>

            <td class="px-4 py-3">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs border"
                :class="effectiveStatus(a)==='BOOKED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : effectiveStatus(a)==='COMPLETED'
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'"
              >
                {{ effectiveStatus(a) }}
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <div class="inline-flex justify-end">
                <button
                  v-if="effectiveStatus(a)==='BOOKED'"
                  type="button"
                  class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
                  @click="cancel(a)"
                >
                  Cancel
                </button>
                <span v-else class="text-xs text-slate-400">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
