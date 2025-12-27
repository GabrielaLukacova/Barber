<template>
  <div class="admin-page">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="admin-title">Opening Hours</h1>
        <p class="admin-subtitle">
          Edit when the shop is open. Use the checkbox to mark days as closed.
        </p>
      </div>

      <button
        type="button"
        class="admin-btn admin-btn--accent"
        :disabled="savingAll || loading || rows.length === 0"
        @click="onSaveAll"
      >
        <span v-if="savingAll">Saving…</span>
        <span v-else>Save all changes</span>
      </button>
    </header>

    <div v-if="error" class="admin-alert admin-alert--error">{{ error }}</div>
    <div v-if="loading" class="admin-alert">Loading opening hours…</div>

    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="text-left">Day</th>
            <th class="text-left">Opens</th>
            <th class="text-left">Closes</th>
            <th class="text-left">Closed</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in rows" :key="row.openingHoursID">
            <td class="font-semibold text-zinc-900">{{ row.dayOfWeek }}</td>

            <td>
              <input
                v-model="row.openLocal"
                type="time"
                class="admin-input"
                style="max-width: 9rem"
                :disabled="row.isClosed || savingAll"
              />
            </td>

            <td>
              <input
                v-model="row.closeLocal"
                type="time"
                class="admin-input"
                style="max-width: 9rem"
                :disabled="row.isClosed || savingAll"
              />
            </td>

            <td>
              <label class="inline-flex items-center gap-2 text-sm text-zinc-800">
                <input
                  type="checkbox"
                  v-model="row.isClosed"
                  class="h-4 w-4"
                  :disabled="savingAll"
                />
                <span>Closed</span>
              </label>
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="4" class="text-center text-zinc-600">No opening hours configured.</td>
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
const savingAll = ref(false);

function toLocalTime(t: string | null): string {
  if (!t) return '';
  return t.slice(0, 5); // "HH:MM"
}

function toBackendTime(value: string | null): string | null {
  if (!value) return null;
  if (value.length === 5) return value + ':00';
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

async function onSaveAll() {
  if (!rows.value.length) return;
  savingAll.value = true;
  error.value = null;

  try {
    await Promise.all(
      rows.value.map((row) => {
        const openingTime = row.isClosed ? null : toBackendTime(row.openLocal || null);
        const closingTime = row.isClosed ? null : toBackendTime(row.closeLocal || null);

        return updateOpeningHour(row, openingTime, closingTime);
      }),
    );

    await load();
  } catch (e) {
    console.error(e);
    error.value = 'Failed to save opening hours.';
  } finally {
    savingAll.value = false;
  }
}

onMounted(load);
</script>
