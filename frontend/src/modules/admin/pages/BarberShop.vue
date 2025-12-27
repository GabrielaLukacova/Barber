<template>
  <div class="admin-page">
    <header>
      <h1 class="admin-title">Barber shop profile</h1>
      <p class="admin-subtitle">
        Set the shop details used on the website (name, address, contact, city).
      </p>
    </header>

    <div v-if="error" class="admin-alert admin-alert--error">{{ error }}</div>
    <div v-if="success" class="admin-alert admin-alert--success">Saved successfully.</div>
    <div v-if="loading" class="admin-alert">Loading…</div>

    <form v-else class="space-y-5" @submit.prevent="onSave">
      <div>
        <label class="admin-label">Name</label>
        <input v-model="form.name" type="text" class="admin-input" placeholder="Kim's Frisør" />
      </div>

      <div>
        <label class="admin-label">Street</label>
        <input v-model="form.street" type="text" class="admin-input" placeholder="Street 1" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Postal code</label>
          <input
            v-model="form.postalCode"
            type="text"
            maxlength="4"
            class="admin-input"
            placeholder="6700"
          />
        </div>
        <div>
          <label class="admin-label">City</label>
          <input v-model="form.city" type="text" class="admin-input" placeholder="Esbjerg" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="admin-label">Phone</label>
          <input
            v-model="form.phoneNumber"
            type="text"
            class="admin-input"
            placeholder="+45 00 00 00 00"
          />
        </div>
        <div>
          <label class="admin-label">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="admin-input"
            placeholder="hello@kimsfrisor.dk"
          />
        </div>
      </div>

      <div>
        <label class="admin-label">Description</label>

        <!-- ✅ IMPORTANT: textarea MUST NOT be self-closing -->
        <textarea
          v-model="form.description"
          rows="4"
          class="admin-textarea"
          placeholder="Short text about the barbershop…"
        ></textarea>
      </div>

      <button type="submit" class="admin-btn admin-btn--accent" :disabled="saving">
        <span v-if="saving">Saving…</span>
        <span v-else>Save changes</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import {
  fetchBarberShop,
  updateBarberShop,
  type BarberShopDto,
} from '@/modules/admin/services/barberShopApi';

const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const form = reactive<BarberShopDto>({
  barberShopID: undefined,
  name: '',
  phoneNumber: null,
  email: null,
  street: null,
  postalCode: null,
  description: null,
  city: null,
});

async function load() {
  loading.value = true;
  error.value = null;
  success.value = false;

  try {
    const data = await fetchBarberShop();

    if (data) {
      form.barberShopID = data.barberShopID;
      form.name = data.name ?? '';
      form.phoneNumber = data.phoneNumber ?? null;
      form.email = data.email ?? null;
      form.street = data.street ?? null;
      form.postalCode = data.postalCode ?? null;
      form.description = data.description ?? null;
      form.city = data.city ?? null;
    } else {
      form.barberShopID = undefined;
      form.name = '';
      form.phoneNumber = null;
      form.email = null;
      form.street = null;
      form.postalCode = null;
      form.description = null;
      form.city = null;
    }
  } catch (e) {
    console.error(e);
    error.value = 'Failed to load barber shop details.';
  } finally {
    loading.value = false;
  }
}

async function onSave() {
  try {
    saving.value = true;
    error.value = null;
    success.value = false;

    const norm = (v: any) => {
      if (v === undefined || v === null) return null;
      const t = String(v).trim();
      return t === '' ? null : t;
    };

    const payload = {
      ...form,
      phoneNumber: norm(form.phoneNumber),
      email: norm(form.email),
      street: norm(form.street),
      postalCode: norm(form.postalCode),
      city: norm((form as any).city),
      description: norm(form.description),
    };

    await updateBarberShop(payload as any);
    success.value = true;

    await load();
  } catch (e: any) {
    console.error(e);
    error.value =
      e?.response?.data?.message || e?.response?.data?.error || 'Failed to save barber shop.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>
