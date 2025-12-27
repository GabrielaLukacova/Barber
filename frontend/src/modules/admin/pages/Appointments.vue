<template>
  <div class="admin-page">
    <header class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        <h1 class="admin-title">Appointments</h1>
        <p class="admin-subtitle">
          Booked (upcoming) shown by default. Past bookings appear under Completed.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <input
          v-model="q"
          class="admin-input w-full sm:w-80"
          placeholder="Search name, email, phone, service, date…"
        />
        <select v-model="statusFilter" class="admin-select w-full sm:w-48">
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>
    </header>

    <div v-if="error" class="admin-alert admin-alert--error">
      {{ error }}
    </div>

    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="text-left">Date</th>
            <th class="text-left">Time</th>
            <th class="text-left">Client</th>
            <th class="text-left">Contact</th>
            <th class="text-left">Services</th>
            <th class="text-left">Duration</th>
            <th class="text-left">Total</th>
            <th class="text-left">Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="9" class="text-zinc-700">Loading…</td>
          </tr>

          <tr v-else-if="filtered.length === 0">
            <td colspan="9" class="text-zinc-700">No appointments found.</td>
          </tr>

          <tr v-else v-for="a in filtered" :key="a.appointmentID">
            <td class="whitespace-nowrap text-zinc-900 font-semibold">
              {{ a.appointmentDate }}
            </td>

            <td class="whitespace-nowrap text-zinc-800">
              {{ fmtTime(a.startTime) }}–{{ fmtTime(a.endTime) }}
            </td>

            <td>
              <div class="font-semibold text-zinc-950">{{ fullName(a) }}</div>
              <div class="text-xs text-zinc-600">#{{ a.appointmentID }}</div>
            </td>

            <td class="text-zinc-800">
              {{ contactText(a) }}
            </td>

            <td class="text-zinc-800 max-w-[340px]">
              <div class="truncate" :title="servicesText(a)">
                {{ servicesText(a) }}
              </div>
            </td>

            <td class="whitespace-nowrap text-zinc-800">
              {{ totalDuration(a) }}
            </td>

            <td class="whitespace-nowrap text-zinc-800">
              {{ fmtPrice(a.totalPriceCents) }}
            </td>

            <td>
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border"
                :class="
                  effectiveStatus(a) === 'BOOKED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : effectiveStatus(a) === 'COMPLETED'
                      ? 'bg-sky-50 text-sky-800 border-sky-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                "
              >
                {{ effectiveStatus(a) }}
              </span>
            </td>

            <td class="text-right">
              <div class="inline-flex justify-end">
                <button
                  v-if="effectiveStatus(a) === 'BOOKED'"
                  type="button"
                  class="admin-btn admin-btn--accent"
                  @click="cancel(a)"
                >
                  Cancel
                </button>
                <span v-else class="text-xs text-zinc-500">—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  fetchAppointmentsWithDetails,
  updateAppointmentStatus,
  type AdminAppointmentRow,
} from '@/modules/admin/services/appointmentsApi';

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
