<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Barber Shop</h1>
        <p class="text-sm text-gray-500">
          Manage basic information about the barber shop (name, address, contact).
        </p>
      </div>
    </header>

    <div v-if="error" class="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
      {{ error }}
    </div>

    <div v-if="success" class="rounded-md bg-green-50 text-green-700 px-4 py-2 text-sm">
      {{ success }}
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading shop info…</div>

    <div v-else class="border rounded-lg bg-white p-6 max-w-xl space-y-4">
      <div class="space-y-1">
        <label class="block text-xs font-medium text-gray-600">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Kim's Frisør"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-xs font-medium text-gray-600">Street</label>
        <input
          v-model="form.street"
          type="text"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="Street 1"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">Postal code</label>
          <input
            v-model="form.postalCode"
            type="text"
            class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="6700"
          />
        </div>
        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-600">Phone</label>
          <input
            v-model="form.phoneNumber"
            type="text"
            class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="+45 00 00 00 00"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="block text-xs font-medium text-gray-600">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="hello@kimsfrisor.dk"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-xs font-medium text-gray-600">Description</label>
        <textarea
          v-model="form.description"
          rows="4"
          class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
          placeholder="Short description of the shop…"
        />
      </div>

      <div class="pt-2 flex justify-end">
        <button
          type="button"
          class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-60"
          :disabled="saving"
          @click="onSave"
        >
          {{ saving ? 'Saving…' : 'Save changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  fetchBarberShop,
  updateBarberShop,
  type BarberShopDto,
} from '@/modules/admin/services/barberShopApi';

const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const form = ref<BarberShopDto>({
  barberShopID: undefined,
  name: '',
  phoneNumber: '',
  email: '',
  street: '',
  postalCode: '',
  description: '',
});

async function load() {
  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    const data = await fetchBarberShop();

    if (!data) {
      // No barber shop yet: keep defaults, allow user to fill in and Save (POST)
      return;
    }

    form.value = {
      barberShopID: data.barberShopID,
      name: data.name ?? '',
      phoneNumber: data.phoneNumber ?? '',
      email: data.email ?? '',
      street: data.street ?? '',
      postalCode: data.postalCode ?? '',
      description: data.description ?? '',
    };
  } catch (e) {
    console.error(e);
    error.value = 'Failed to load barber shop data.';
  } finally {
    loading.value = false;
  }
}

async function onSave() {
  saving.value = true;
  error.value = null;
  success.value = null;

  try {
    await updateBarberShop(form.value);
    success.value = 'Saved successfully.';
    await load();
  } catch (e) {
    console.error(e);
    error.value = 'Failed to save barber shop data.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>
