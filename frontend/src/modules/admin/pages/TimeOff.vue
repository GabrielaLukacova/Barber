<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import {
  getFutureTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
  type TimeOffRow,
} from '@/modules/admin/services/timeOffApi';

type Mode = 'DAY' | 'RANGE' | 'HOURS';

type UiRow = {
  timeOffID: number | null;

  mode: Mode;

  // day date
  date: string; // YYYY-MM-DD

  // range dates
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD

  // hours inputs
  hoursDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM

  reason: string;

  dirty: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
};

const loading = ref(false);
const globalError = ref<string | null>(null);
const success = ref(false);
const rows = reactive<UiRow[]>([]);

function setSuccess() {
  success.value = true;
  setTimeout(() => (success.value = false), 1500);
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function toTimeInput(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function isoToLocalParts(iso: string) {
  const d = new Date(iso);
  return { date: toDateInput(d), time: toTimeInput(d) };
}

function localDateTimeToIso(date: string, time: string) {
  // local input to iso
  return new Date(`${date}T${time}`).toISOString();
}

function dateOnlyToIsoStart(date: string) {
  return localDateTimeToIso(date, '00:00');
}
function dateOnlyToIsoEnd(date: string) {
  // end of day
  return localDateTimeToIso(date, '23:59');
}

function inferModeFromRow(r: TimeOffRow): Mode {
  const s = isoToLocalParts(r.start);
  const e = isoToLocalParts(r.end);

  if (s.date === e.date && s.time === '00:00' && (e.time === '23:59' || e.time === '23:58')) {
    return 'DAY';
  }

  if (s.time === '00:00' && (e.time === '23:59' || e.time === '23:58')) {
    return s.date === e.date ? 'DAY' : 'RANGE';
  }

  return 'HOURS';
}

function rowToPayload(r: UiRow) {
  if (r.mode === 'DAY') {
    return {
      start: dateOnlyToIsoStart(r.date),
      end: dateOnlyToIsoEnd(r.date),
      reason: r.reason.trim() ? r.reason.trim() : null,
    };
  }

  if (r.mode === 'RANGE') {
    return {
      start: dateOnlyToIsoStart(r.startDate),
      end: dateOnlyToIsoEnd(r.endDate),
      reason: r.reason.trim() ? r.reason.trim() : null,
    };
  }

  return {
    start: localDateTimeToIso(r.hoursDate, r.startTime),
    end: localDateTimeToIso(r.hoursDate, r.endTime),
    reason: r.reason.trim() ? r.reason.trim() : null,
  };
}

function validateRow(r: UiRow): string | null {
  if (r.reason.length > 500) return 'Reason is too long (max 500)';

  if (r.mode === 'DAY') {
    if (!r.date) return 'Date is required';
    return null;
  }

  if (r.mode === 'RANGE') {
    if (!r.startDate || !r.endDate) return 'Start and end date are required';
    const s = new Date(`${r.startDate}T00:00`).getTime();
    const e = new Date(`${r.endDate}T00:00`).getTime();
    if (!Number.isFinite(s) || !Number.isFinite(e)) return 'Invalid date';
    if (e < s) return 'End date must be after start date';
    return null;
  }

  if (!r.hoursDate) return 'Date is required';
  if (!r.startTime || !r.endTime) return 'Start and end time are required';
  const s = new Date(`${r.hoursDate}T${r.startTime}`).getTime();
  const e = new Date(`${r.hoursDate}T${r.endTime}`).getTime();
  if (!Number.isFinite(s) || !Number.isFinite(e)) return 'Invalid date/time';
  if (e <= s) return 'End time must be after start time';
  return null;
}

function markDirty(r: UiRow) {
  r.dirty = true;
  r.error = null;
}

function makeEmptyRow(): UiRow {
  const now = new Date();
  const date = toDateInput(now);
  const start = new Date(now.getTime() + 60 * 60 * 1000);
  const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  return {
    timeOffID: null,
    mode: 'DAY',

    date,

    startDate: date,
    endDate: date,

    hoursDate: date,
    startTime: toTimeInput(start),
    endTime: toTimeInput(end),

    reason: '',
    dirty: true,
    saving: false,
    deleting: false,
    error: null,
  };
}

function addRow() {
  rows.unshift(makeEmptyRow());
}

function formatPreview(r: UiRow) {
  try {
    const p = rowToPayload(r);
    const s = new Date(p.start);
    const e = new Date(p.end);

    const dateFmt = new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

    if (r.mode === 'DAY') return `${dateFmt.format(s)} (all day)`;
    if (r.mode === 'RANGE') return `${dateFmt.format(s)} → ${dateFmt.format(e)} (all day)`;
    return `${dateFmt.format(s)} · ${timeFmt.format(s)}–${timeFmt.format(e)}`;
  } catch {
    return '';
  }
}

async function load() {
  loading.value = true;
  globalError.value = null;
  rows.splice(0, rows.length);

  try {
    const data = await getFutureTimeOff();
    for (const r of data) {
      const mode = inferModeFromRow(r);
      const s = isoToLocalParts(r.start);
      const e = isoToLocalParts(r.end);

      rows.push({
        timeOffID: r.timeOffID,
        mode,

        date: s.date,

        startDate: s.date,
        endDate: e.date,

        hoursDate: s.date,
        startTime: s.time,
        endTime: e.time,

        reason: r.reason ?? '',
        dirty: false,
        saving: false,
        deleting: false,
        error: null,
      });
    }
  } catch (e: any) {
    globalError.value = e?.response?.data?.message ?? e?.message ?? 'Failed to load time off';
  } finally {
    loading.value = false;
  }
}

async function saveRow(r: UiRow) {
  r.error = validateRow(r);
  if (r.error) return;

  r.saving = true;
  globalError.value = null;

  try {
    const payload = rowToPayload(r);

    let saved: TimeOffRow;
    if (r.timeOffID == null) {
      saved = await createTimeOff(payload);
      r.timeOffID = saved.timeOffID;
    } else {
      saved = await updateTimeOff(r.timeOffID, payload);
    }

    // sync from response
    const mode = inferModeFromRow(saved);
    const s = isoToLocalParts(saved.start);
    const e = isoToLocalParts(saved.end);

    r.mode = mode;
    r.date = s.date;
    r.startDate = s.date;
    r.endDate = e.date;
    r.hoursDate = s.date;
    r.startTime = s.time;
    r.endTime = e.time;
    r.reason = saved.reason ?? '';
    r.dirty = false;

    setSuccess();
    await load();
  } catch (e: any) {
    const msg = e?.response?.data?.errors?.fieldErrors
      ? Object.entries(e.response.data.errors.fieldErrors)
          .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ')
      : (e?.response?.data?.message ?? e?.message ?? 'Save failed');
    r.error = msg;
  } finally {
    r.saving = false;
  }
}

async function removeRow(r: UiRow, idx: number) {
  r.error = null;
  globalError.value = null;

  if (r.timeOffID == null) {
    rows.splice(idx, 1);
    return;
  }

  r.deleting = true;
  try {
    await deleteTimeOff(r.timeOffID);
    rows.splice(idx, 1);
    setSuccess();
  } catch (e: any) {
    r.error = e?.response?.data?.message ?? e?.message ?? 'Delete failed';
  } finally {
    r.deleting = false;
  }
}

const hasAny = computed(() => rows.length > 0);

onMounted(load);
</script>

<template>
  <div class="admin-page">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="admin-title">Special hours</h1>
        <p class="admin-subtitle">
          Create announcements like holiday closures or adjusted hours. These show on the public site only
          when added.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button type="button" class="admin-btn admin-btn--accent" @click="addRow">
          Add special hours
        </button>
        <button type="button" class="admin-btn" :disabled="loading" @click="load">Refresh</button>
      </div>
    </header>

    <div v-if="globalError" class="admin-alert admin-alert--error">{{ globalError }}</div>
    <div v-if="success" class="admin-alert admin-alert--success">Saved successfully.</div>
    <div v-if="loading" class="admin-alert">Loading…</div>

    <div v-else class="space-y-4">
      <div v-if="!hasAny" class="admin-surface">
        <p class="admin-help" style="color: var(--admin-muted)">No upcoming announcements.</p>
      </div>

      <div v-else class="admin-table-wrap">
        <table class="admin-table" style="min-width: 980px">
          <thead>
            <tr>
              <th class="text-left w-[180px]">Type</th>
              <th class="text-left">Details</th>
              <th class="text-left">Reason</th>
              <th class="text-left w-[240px]">Preview</th>
              <th class="text-left w-[220px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(r, idx) in rows"
              :key="r.timeOffID ?? `new-${idx}`"
              :style="r.dirty ? 'background: rgba(199,164,125,0.06)' : ''"
            >
              <td class="align-top">
                <select v-model="r.mode" class="admin-select" @change="markDirty(r)">
                  <option value="DAY">Closed (1 day)</option>
                  <option value="RANGE">Holiday (multiple days)</option>
                  <option value="HOURS">Adjusted hours</option>
                </select>
              </td>

              <td class="align-top">
                <div v-if="r.mode === 'DAY'" class="space-y-2">
                  <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                    >Date</label
                  >
                  <input v-model="r.date" type="date" class="admin-input" @input="markDirty(r)" />
                </div>

                <div v-else-if="r.mode === 'RANGE'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                      >Start date</label
                    >
                    <input
                      v-model="r.startDate"
                      type="date"
                      class="admin-input"
                      @input="markDirty(r)"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                      >End date</label
                    >
                    <input
                      v-model="r.endDate"
                      type="date"
                      class="admin-input"
                      @input="markDirty(r)"
                    />
                  </div>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="space-y-2">
                    <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                      >Date</label
                    >
                    <input
                      v-model="r.hoursDate"
                      type="date"
                      class="admin-input"
                      @input="markDirty(r)"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                      >From</label
                    >
                    <input
                      v-model="r.startTime"
                      type="time"
                      class="admin-input"
                      @input="markDirty(r)"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="admin-label" style="font-size: 0.75rem; color: var(--admin-muted)"
                      >To</label
                    >
                    <input
                      v-model="r.endTime"
                      type="time"
                      class="admin-input"
                      @input="markDirty(r)"
                    />
                  </div>
                </div>

                <p v-if="r.error" class="mt-2" style="font-size: 0.75rem; color: #b91c1c">
                  {{ r.error }}
                </p>
              </td>

              <td class="align-top">
                <input
                  v-model="r.reason"
                  type="text"
                  class="admin-input"
                  placeholder="Optional (e.g. Christmas holiday)"
                  @input="markDirty(r)"
                />
                <p class="admin-help mt-2" style="color: var(--admin-muted)">
                  Optional. If empty, only the dates will show.
                </p>
              </td>

              <td class="align-top">
                <p style="color: var(--admin-text); font-weight: 600">
                  {{ formatPreview(r) }}
                </p>
              </td>

              <td class="align-top">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="admin-btn admin-btn--accent"
                    :disabled="r.saving || r.deleting || !r.dirty"
                    @click="saveRow(r)"
                  >
                    {{ r.saving ? 'Saving…' : 'Save' }}
                  </button>

                  <button
                    type="button"
                    class="admin-btn admin-btn--danger"
                    :disabled="r.saving || r.deleting"
                    @click="removeRow(r, idx)"
                  >
                    {{ r.deleting ? 'Deleting…' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="admin-help" style="color: var(--admin-muted)">
        Dates/times are entered in your local timezone and stored as ISO timestamps.
      </p>
    </div>
  </div>
</template>