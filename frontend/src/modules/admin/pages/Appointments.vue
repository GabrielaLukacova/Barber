<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { deleteAppointment, fetchAppointmentsWithDetails, updateAppointmentStatus, type AdminAppointmentRow } from '@/modules/admin/services/appointmentsApi';

const items = ref<AdminAppointmentRow[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const q = ref('');
const statusFilter = ref<'ALL' | 'BOOKED' | 'CANCELLED' | 'COMPLETED'>('ALL');

const filtered = computed(() => {
  const query = q.value.trim().toLowerCase();
  return items.value.filter((a) => {
    if (statusFilter.value !== 'ALL' && a.status !== statusFilter.value) return false;
    if (!query) return true;
    const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim().toLowerCase();
    const email = (a.email ?? '').toLowerCase();
    const phone = (a.phoneNumber ?? '').toLowerCase();
    const services = (a.services ?? []).map((s) => s.name.toLowerCase()).join(' ');
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

async function setStatus(a: AdminAppointmentRow, status: 'BOOKED' | 'CANCELLED' | 'COMPLETED') {
  try {
    await updateAppointmentStatus(a.appointmentID, status);
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.error ?? 'Failed to update status';
  }
}

async function remove(a: AdminAppointmentRow) {
  try {
    await deleteAppointment(a.appointmentID);
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.error ?? 'Failed to delete appointment';
  }
}

function fmtTime(t: string) {
  return (t ?? '').slice(0, 5);
}
function fmtPrice(cents: number | null) {
  if (typeof cents !== 'number') return '—';
  return `${Math.round(cents / 100)} DKK`;
}

onMounted(load);
</script>

<template>
  <div class="p-8 text-slate-50">
    <div class="flex items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Appointments</h1>
        <p class="text-slate-400">All bookings (including public bookings).</p>
      </div>
      <button class="btn btn-ghost" type="button" @click="load()" :disabled="loading">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <div v-if="error" class="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </div>

    <div class="flex flex-wrap items-center gap-3 mb-4">
      <input
        v-model="q"
        class="w-full md:w-80 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-400"
        placeholder="Search name, email, phone, service, date…"
      />
      <select
        v-model="statusFilter"
        class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-50"
      >
        <option value="ALL">All</option>
        <option value="BOOKED">Booked</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="COMPLETED">Completed</option>
      </select>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-white/10">
      <table class="min-w-full text-sm">
        <thead class="bg-white/5 text-slate-200">
          <tr>
            <th class="text-left px-4 py-3">Date</th>
            <th class="text-left px-4 py-3">Time</th>
            <th class="text-left px-4 py-3">Client</th>
            <th class="text-left px-4 py-3">Services</th>
            <th class="text-left px-4 py-3">Total</th>
            <th class="text-left px-4 py-3">Status</th>
            <th class="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-white/10">
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-6 text-slate-300">Loading…</td>
          </tr>

          <tr v-else-if="filtered.length === 0">
            <td colspan="7" class="px-4 py-6 text-slate-300">No appointments found.</td>
          </tr>

          <tr v-else v-for="a in filtered" :key="a.appointmentID" class="hover:bg-white/5">
            <td class="px-4 py-3">{{ a.appointmentDate }}</td>
            <td class="px-4 py-3">{{ fmtTime(a.startTime) }}–{{ fmtTime(a.endTime) }}</td>
            <td class="px-4 py-3">
              <div class="font-medium text-slate-50">
                {{ [a.firstName, a.lastName].filter(Boolean).join(' ') || 'Guest' }}
              </div>
              <div class="text-slate-400">
                {{ a.email || a.phoneNumber || '—' }}
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="text-slate-200">
                {{ (a.services ?? []).map((s) => s.name).join(', ') || '—' }}
              </div>
            </td>
            <td class="px-4 py-3">{{ fmtPrice(a.totalPriceCents) }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center rounded-full px-3 py-1 text-xs"
                :class="a.status==='BOOKED' ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30'
                  : a.status==='COMPLETED' ? 'bg-sky-500/15 text-sky-200 border border-sky-400/30'
                  : 'bg-amber-500/15 text-amber-200 border border-amber-400/30'">
                {{ a.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex flex-wrap justify-end gap-2">
                <button class="btn btn-ghost" type="button" @click="setStatus(a, 'BOOKED')">Book</button>
                <button class="btn btn-ghost" type="button" @click="setStatus(a, 'COMPLETED')">Complete</button>
                <button class="btn btn-ghost" type="button" @click="setStatus(a, 'CANCELLED')">Cancel</button>
                <button class="btn btn-ghost" type="button" @click="remove(a)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
