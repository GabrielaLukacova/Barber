<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useServicesStore } from '@/modules/public/stores/services';
import { useBookingStore } from '@/modules/public/stores/booking';
import { fetchAvailableSlots, publicBook } from '@/modules/public/services/bookingApi';

const servicesStore = useServicesStore();
const booking = useBookingStore();
const bookingAny = booking as any;

// local yyyy-mm-dd
function localISODate(d = new Date()) {
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}
const todayISO = localISODate();

const slots = ref<string[]>([]);
const durationMin = ref<number>(0);
const loadingSlots = ref(false);
const submitting = ref(false);
const errorMsg = ref<string | null>(null);

// day availability state
const dayStatus = ref<'idle' | 'open' | 'closed' | 'noSlots'>('idle');

// step 3 validation
const triedSubmit = ref(false);
const touched = ref({ name: false, email: false, phone: false });

onMounted(async () => {
  await servicesStore.load();
  if (!bookingAny.services) bookingAny.services = [];
});

const selectedServiceIDs = computed<number[]>(() =>
  (bookingAny.services ?? []).map((s: any) => s?.id).filter((id: any) => typeof id === 'number'),
);

const totalPriceDKK = computed(() =>
  (bookingAny.services ?? []).reduce((sum: number, s: any) => sum + (s?.priceCents ?? 0) / 100, 0),
);

function isSelected(id?: number) {
  if (!id) return false;
  return (bookingAny.services ?? []).some((x: any) => x?.id === id);
}

function toggleService(svc: any) {
  const id = svc?.id as number | undefined;
  if (!id) return;

  const list = bookingAny.services ?? [];
  const exists = list.some((x: any) => x?.id === id);
  bookingAny.services = exists ? list.filter((x: any) => x?.id !== id) : [...list, svc];
}

function resetTimeSelection() {
  bookingAny.slot = null;
  slots.value = [];
  durationMin.value = 0;
  dayStatus.value = 'idle';
}

async function loadSlots() {
  errorMsg.value = null;
  slots.value = [];
  durationMin.value = 0;
  dayStatus.value = 'idle';

  if (!bookingAny.dateISO || selectedServiceIDs.value.length === 0) return;

  loadingSlots.value = true;
  try {
    const data: any = await fetchAvailableSlots({
      date: bookingAny.dateISO,
      serviceIDs: selectedServiceIDs.value as number[],
    });

    slots.value = Array.isArray(data?.slots) ? data.slots : [];
    durationMin.value = Number(data?.durationMin ?? 0);

    // optional api field
    const isClosed = data?.isClosed === true;
    if (isClosed) {
      dayStatus.value = 'closed';
      bookingAny.slot = null;
    } else if (slots.value.length > 0) {
      dayStatus.value = 'open';
      if (!slots.value.includes(bookingAny.slot)) bookingAny.slot = null;
    } else {
      dayStatus.value = 'noSlots';
      bookingAny.slot = null;
    }
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.error ?? 'Could not load available slots';
  } finally {
    loadingSlots.value = false;
  }
}

watch(
  [() => bookingAny.dateISO, () => selectedServiceIDs.value.slice().sort().join(',')],
  async ([newDate, newSvcKey], [oldDate, oldSvcKey]) => {
    if (newDate === oldDate && newSvcKey === oldSvcKey) return;
    resetTimeSelection();
    if (bookingAny.step >= 2) await loadSlots();
  },
);

const stepLabels = [
  { n: 1, title: 'Services' },
  { n: 2, title: 'Date & time' },
  { n: 3, title: 'Details' },
  { n: 4, title: 'Done' },
];

const stepTitle = computed(
  () => stepLabels.find((s) => s.n === bookingAny.step)?.title ?? 'Booking',
);

const nameOk = computed(() => !!bookingAny.customerName?.trim());
const emailOk = computed(() => !!bookingAny.customerEmail?.trim());
const phoneOk = computed(() => !!bookingAny.customerPhone?.trim());
const contactOk = computed(() => emailOk.value || phoneOk.value);

const showNameError = computed(() => (touched.value.name || triedSubmit.value) && !nameOk.value);
const showContactError = computed(
  () => (touched.value.email || touched.value.phone || triedSubmit.value) && !contactOk.value,
);

const canNext = computed(() => {
  if (bookingAny.step === 1) return selectedServiceIDs.value.length > 0;
  if (bookingAny.step === 2)
    return !!bookingAny.dateISO && !!bookingAny.slot && dayStatus.value === 'open';
  if (bookingAny.step === 3) return nameOk.value && contactOk.value;
  return true;
});

async function submit() {
  triedSubmit.value = true;
  touched.value.name = true;
  touched.value.email = true;
  touched.value.phone = true;

  if (!bookingAny.dateISO || !bookingAny.slot || selectedServiceIDs.value.length === 0) return;
  if (!nameOk.value || !contactOk.value) return;

  submitting.value = true;
  errorMsg.value = null;

  try {
    await publicBook({
      serviceIDs: selectedServiceIDs.value as number[],
      date: bookingAny.dateISO,
      startTime: bookingAny.slot,
      customerName: bookingAny.customerName,
      customerEmail: bookingAny.customerEmail || undefined,
      customerPhone: bookingAny.customerPhone || undefined,
    });
    bookingAny.step = 4;
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 409) {
      errorMsg.value =
        e?.response?.data?.error ?? 'That time was just taken. Please choose another slot.';
      await loadSlots();
      bookingAny.step = 2;
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

async function goNext() {
  if (bookingAny.step === 1) {
    bookingAny.step = 2;
    await loadSlots();
    return;
  }
  if (bookingAny.step === 2 && dayStatus.value !== 'open') return;
  bookingAny.step++;
}

function goBack() {
  bookingAny.step = Math.max(1, (bookingAny.step ?? 1) - 1);
}

function fmtPriceDKK(cents: number) {
  const val = (cents ?? 0) / 100;
  return `${val.toFixed(0)} DKK`;
}

function fmtPrettyDate(iso?: string | null) {
  if (!iso) return '—';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return iso;

  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
}

function resetAllUX() {
  triedSubmit.value = false;
  touched.value = { name: false, email: false, phone: false };
}
</script>

<template>
  <div class="booking-root">
    <div class="layout">
      <!-- MAIN -->
      <div class="panel">
        <div class="header-row">
          <div class="header-copy">
            <div class="step-title">{{ stepTitle }}</div>
          </div>

          <div class="stepper">
            <div class="stepper-row">
              <div v-for="s in stepLabels" :key="s.n">
                <div
                  class="step-dot"
                  :class="
                    bookingAny.step === s.n ? 'is-active' : bookingAny.step > s.n ? 'is-done' : ''
                  "
                >
                  {{ s.n }}
                </div>
              </div>
            </div>

            <div class="stepper-bar">
              <div
                class="stepper-bar-fill"
                :style="{ width: `${((Math.max(1, bookingAny.step) - 1) / 3) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <div v-if="errorMsg" class="alert alert-error">{{ errorMsg }}</div>

        <!-- STEP 1 -->
        <div v-if="bookingAny.step === 1" class="step">
          <div class="services-grid">
            <button
              v-for="s in servicesStore.items"
              :key="s.id"
              type="button"
              class="service-tile"
              :class="isSelected(s.id) ? 'is-selected' : ''"
              @click="toggleService(s)"
            >
              <div class="tile-row">
                <div class="tile-main">
                  <div class="tile-name">{{ s.name }}</div>
                  <div class="tile-meta">{{ s.durationMin }} min</div>
                </div>
                <div class="tile-price">{{ fmtPriceDKK(s.priceCents) }}</div>
              </div>
            </button>
          </div>

          <div class="inline-summary">
            <div>
              <span class="em">{{ selectedServiceIDs.length }}</span> selected
            </div>
            <div>
              Estimated total: <span class="em">{{ totalPriceDKK.toFixed(0) }} DKK</span>
            </div>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-else-if="bookingAny.step === 2" class="step">
          <div class="two-col">
            <div class="pane">
              <div class="pane-head">
                <div class="pane-title">Date</div>
                <div class="pane-meta">{{ fmtPrettyDate(bookingAny.dateISO) }}</div>
              </div>

              <input
                class="input"
                type="date"
                :min="todayISO"
                v-model="bookingAny.dateISO"
                :disabled="submitting"
              />
            </div>

            <div class="pane">
              <div class="pane-head">
                <div class="pane-title">Time</div>
                <div class="pane-meta" v-if="bookingAny.dateISO">{{ slots.length }}</div>
              </div>

              <div v-if="!bookingAny.dateISO" class="hint">—</div>

              <div v-else-if="loadingSlots" class="skeletons">
                <div class="skeleton" />
                <div class="skeleton" />
                <div class="skeleton" />
              </div>

              <div v-else>
                <div v-if="dayStatus === 'closed'" class="alert">Closed</div>
                <div v-else-if="dayStatus === 'noSlots'" class="alert">No availability</div>

                <div v-if="slots.length" class="times">
                  <button
                    v-for="t in slots"
                    :key="t"
                    type="button"
                    class="btn"
                    :class="bookingAny.slot === t ? 'btn-primary' : 'btn-ghost'"
                    :disabled="submitting"
                    @click="bookingAny.slot = t"
                  >
                    {{ t }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-else-if="bookingAny.step === 3" class="step">
          <div class="two-col">
            <div class="col-span-2">
              <label class="label">Name</label>
              <input
                v-model="bookingAny.customerName"
                class="input"
                :class="showNameError ? 'input-error' : ''"
                @blur="touched.name = true"
                :disabled="submitting"
              />
              <div v-if="showNameError" class="error-text">Required</div>
            </div>

            <div>
              <label class="label">Email</label>
              <input
                v-model="bookingAny.customerEmail"
                type="email"
                class="input"
                :class="showContactError ? 'input-error' : ''"
                @blur="touched.email = true"
                :disabled="submitting"
              />
            </div>

            <div>
              <label class="label">Phone</label>
              <input
                v-model="bookingAny.customerPhone"
                class="input"
                :class="showContactError ? 'input-error' : ''"
                @blur="touched.phone = true"
                :disabled="submitting"
              />
            </div>

            <div v-if="showContactError" class="alert alert-error-soft col-span-2">
              Email or phone required
            </div>
          </div>
        </div>

        <!-- STEP 4 -->
        <div v-else-if="bookingAny.step === 4" class="step done">
          <div class="done-wrap">
            <h3 class="done-title">Booking confirmed</h3>

            <div class="confirm">
              <div class="row">
                <span class="muted">When</span>
                <span class="em"
                  >{{ fmtPrettyDate(bookingAny.dateISO) }} · {{ bookingAny.slot || '—' }}</span
                >
              </div>

              <div class="row">
                <span class="muted">Total</span>
                <span class="em">{{ totalPriceDKK.toFixed(0) }} DKK</span>
              </div>
            </div>

            <button
              class="btn btn-ghost"
              type="button"
              @click="
                booking.reset();
                resetAllUX();
              "
            >
              Book another
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div class="controls">
          <button
            class="btn btn-ghost"
            type="button"
            :disabled="bookingAny.step === 1 || submitting"
            @click="goBack()"
          >
            Back
          </button>

          <div class="controls-right">
            <button
              v-if="bookingAny.step < 3"
              class="btn btn-primary"
              :disabled="!canNext || submitting || loadingSlots"
              @click="goNext()"
            >
              Continue
            </button>

            <button
              v-else-if="bookingAny.step === 3"
              class="btn btn-primary"
              :disabled="!canNext || submitting"
              @click="submit()"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="panel">
        <div class="summary-head">
          <div class="summary-title">Summary</div>
        </div>

        <div class="summary-block">
          <div class="muted">Services</div>
          <div v-if="!(bookingAny.services ?? []).length" class="muted">—</div>
          <ul v-else class="services-list">
            <li v-for="s in bookingAny.services" :key="s.id" class="row">
              <span class="truncate">{{ s.name }}</span>
              <span class="muted">{{ fmtPriceDKK(s.priceCents) }}</span>
            </li>
          </ul>
        </div>

        <div class="divider" />

        <div class="summary-block">
          <div class="row">
            <span class="muted">Date</span>
            <span class="value">{{
              bookingAny.dateISO ? fmtPrettyDate(bookingAny.dateISO) : '—'
            }}</span>
          </div>
          <div class="row">
            <span class="muted">Time</span>
            <span class="value">{{ bookingAny.slot || '—' }}</span>
          </div>
          <div class="row">
            <span class="muted">Duration</span>
            <span class="value">{{ durationMin ? durationMin + ' min' : '—' }}</span>
          </div>
        </div>

        <div class="divider" />

        <div class="row total-row">
          <span class="muted">Estimated total</span>
          <span class="em">{{ totalPriceDKK.toFixed(0) }} DKK</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-root {
  color: var(--text);

  --v1: 8px;
  --v2: 12px;
  --v3: 16px;
  --v4: 24px;
  --v5: 32px;

  --innerX: clamp(14px, 1.5vw, 22px);
  --innerY: clamp(14px, 1.6vw, 22px);
}

/* no radius */
.booking-root,
.booking-root * {
  border-radius: 0 !important;
}

/* layout grid */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--v4);
}
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: start;
  }
}

/* main panels */
.panel {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015));
  padding: var(--innerY) var(--innerX);
}

/* header layout */
.header-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--v3);
  padding-bottom: var(--v3);
  border-bottom: 1px solid var(--border);
}
@media (min-width: 640px) {
  .header-row {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
}

.step-meta {
  margin: 0 0 var(--v1) 0;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted2);
}
.step-title {
  margin: 0 0 var(--v1) 0;
  font-size: 22px;
  font-weight: 750;
  color: var(--text);
}
.step-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--muted);
}

/* stepper ui */
.stepper {
  width: 220px;
}
.stepper-row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.step-dot {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  color: var(--muted2);
}
.step-dot.is-active {
  background: var(--gold);
  color: #0f1216;
  border-color: var(--gold);
}
.step-dot.is-done {
  background: rgba(242, 244, 247, 0.92);
  color: #0f1216;
  border-color: rgba(242, 244, 247, 0.92);
}

.stepper-bar {
  margin-top: var(--v2);
  height: 2px;
  background: rgba(255, 255, 255, 0.07);
}
.stepper-bar-fill {
  height: 2px;
  background: var(--gold);
  width: 0;
}

/* step spacing */
.step {
  padding-top: var(--v4);
  padding-bottom: var(--v4);
}

/* service tiles */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--v2);
}
@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.service-tile {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  padding: 14px 14px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}
.service-tile:hover {
  border-color: rgba(199, 164, 125, 0.55);
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-1px);
}
.service-tile.is-selected {
  border-color: rgba(199, 164, 125, 0.65);
  background: rgba(199, 164, 125, 0.06);
}

.tile-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--v2);
}
.tile-main {
  min-width: 0;
}
.tile-name {
  font-weight: 750;
  color: var(--text);
}
.tile-meta {
  margin-top: 6px;
  font-size: 13px;
  color: var(--muted2);
}
.tile-price {
  font-weight: 750;
  color: var(--text);
}

/* summary line */
.inline-summary {
  margin-top: var(--v4);
  padding-top: var(--v3);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  gap: var(--v3);
  color: var(--muted);
}

/* two column */
.two-col {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--v3);
}
@media (min-width: 768px) {
  .two-col {
    grid-template-columns: 1fr 1fr;
  }
}
.col-span-2 {
  grid-column: 1 / -1;
}

.pane {
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.015);
  padding: 14px 14px;
}

.pane-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--v2);
}
.pane-title {
  font-weight: 750;
  color: var(--text);
}
.pane-meta {
  font-size: 12px;
  color: var(--muted2);
}

/* inputs */
.label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--muted2);
}
.input {
  width: 100%;
  border: 1px solid var(--border2);
  background: rgba(15, 18, 22, 0.35);
  color: var(--text);
  padding: 10px 12px;
}
.input:focus {
  border-color: rgba(199, 164, 125, 0.65);
  box-shadow: 0 0 0 4px rgba(199, 164, 125, 0.12);
  outline: none;
}
.input-error {
  border-color: rgba(248, 113, 113, 0.55);
}
.error-text {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(252, 165, 165, 0.95);
}

/* helpers */
.hint {
  margin-top: var(--v2);
  font-size: 12px;
  color: var(--muted2);
}
.muted {
  color: var(--muted2);
}
.value {
  color: var(--text);
  font-weight: 650;
}
.em {
  color: var(--text);
  font-weight: 750;
}

/* alerts */
.alert {
  margin-top: var(--v2);
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 12px;
  color: var(--muted);
}
.alert-error {
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(248, 113, 113, 0.06);
  color: rgba(254, 226, 226, 0.95);
}
.alert-error-soft {
  border-color: rgba(248, 113, 113, 0.28);
  background: rgba(248, 113, 113, 0.05);
  color: rgba(254, 226, 226, 0.95);
}

/* slots list */
.times {
  margin-top: var(--v2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--v2);
}

/* footer controls */
.controls {
  padding-top: var(--v3);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--v3);
}
.controls-right {
  display: flex;
  gap: var(--v2);
}

/* right summary */
.summary-head {
  padding-bottom: var(--v3);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-title {
  font-weight: 750;
  color: var(--text);
}
.summary-meta {
  font-size: 12px;
  color: var(--muted2);
}

.summary-block {
  padding-top: var(--v3);
  padding-bottom: var(--v3);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--v3);
  padding: 10px 0;
}

.services-list {
  margin-top: 8px;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.divider {
  height: 1px;
  background: var(--border);
}

.total-row {
  padding-top: 12px;
}

/* success step */
.done-wrap {
  padding-top: var(--v4);
  padding-bottom: var(--v4);
  text-align: center;
}
.done-title {
  margin: 0 0 var(--v2) 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
}
.done-sub {
  margin: 0 0 var(--v3) 0;
  color: var(--muted);
}

.confirm {
  text-align: left;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  padding: 12px 14px;
  margin-bottom: var(--v3);
}
</style>