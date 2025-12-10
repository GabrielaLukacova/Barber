<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Opening Hours</h1>
        <p class="text-sm text-gray-500">
          Edit when the shop is open. Use the checkbox to mark days as closed.
        </p>
      </div>
    </header>

    <div v-if="error" class="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
      {{ error }}
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading opening hours…</div>

    <div v-else class="overflow-x-auto border rounded-lg bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
          <tr>
            <th class="px-4 py-2">Day</th>
            <th class="px-4 py-2">Opens</th>
            <th class="px-4 py-2">Closes</th>
            <th class="px-4 py-2">Closed</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.openingHoursID"
            class="border-t last:border-b"
          >
            <td class="px-4 py-2 font-medium text-gray-900">
              {{ row.dayOfWeek }}
            </td>
            <td class="px-4 py-2">
              <input
                v-model="row.openLocal"
                type="time"
                class="w-28 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                :disabled="row.isClosed || savingId === row.openingHoursID"
              />
            </td>
            <td class="px-4 py-2">
              <input
                v-model="row.closeLocal"
                type="time"
                class="w-28 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                :disabled="row.isClosed || savingId === row.openingHoursID"
              />
            </td>
            <td class="px-4 py-2">
              <label class="inline-flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="checkbox"
                  v-model="row.isClosed"
                  class="rounded border-gray-300 text-black focus:ring-black"
                  :disabled="savingId === row.openingHoursID"
                />
                <span>Closed</span>
              </label>
            </td>
            <td class="px-4 py-2 text-right">
              <button
                type="button"
                class="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
                :disabled="savingId === row.openingHoursID"
                @click="onSave(row)"
              >
                {{ savingId === row.openingHoursID ? 'Saving…' : 'Save' }}
              </button>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="5" class="px-4 py-4 text-center text-gray-400 text-sm">
              No opening hours configured.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  fetchOpeningHours,
  updateOpeningHour,
  type OpeningHoursDto,
} from '@/modules/admin/services/openingHoursApi';

interface OpeningHoursRow extends OpeningHoursDto {
  openLocal: string;
  closeLocal: string;
  isClosed: boolean;
}

const rows = ref<OpeningHoursRow[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const savingId = ref<number | null>(null);

function toLocalTime(t: string | null): string {
  if (!t) return '';
  // Expect "HH:MM" or "HH:MM:SS" from backend
  return t.slice(0, 5);
}

function toBackendTime(value: string | null): string | null {
  if (!value) return null;
  // convert "HH:MM" -> "HH:MM:00"
  if (value.length === 5) {
    return value + ':00';
  }
  return value;
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchOpeningHours();
    rows.value = data.map((row) => {
      const isClosed = row.openingTime == null || row.closingTime == null;
      return {
        ...row,
        openLocal: isClosed ? '' : toLocalTime(row.openingTime),
        closeLocal: isClosed ? '' : toLocalTime(row.closingTime),
        isClosed,
      };
    });
  } catch (e) {
    console.error(e);
    error.value = 'Failed to load opening hours.';
  } finally {
    loading.value = false;
  }
}

async function onSave(row: OpeningHoursRow) {
  try {
    savingId.value = row.openingHoursID;
    error.value = null;

    const openingTime = row.isClosed ? null : toBackendTime(row.openLocal || null);
    const closingTime = row.isClosed ? null : toBackendTime(row.closeLocal || null);

    await updateOpeningHour(row, openingTime, closingTime);

    // reload to ensure we see normalized values
    await load();
  } catch (e) {
    console.error(e);
    error.value = 'Failed to save opening hours.';
  } finally {
    savingId.value = null;
  }
}

onMounted(load);
</script>
