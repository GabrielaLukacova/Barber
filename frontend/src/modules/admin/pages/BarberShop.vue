<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Barber shop profile</h1>
        <p class="text-sm text-gray-500">
          Set the shop details used on the website (name, address, contact, city).
        </p>
      </div>
    </header>

    <div v-if="error" class="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
      {{ error }}
    </div>

    <div v-if="success" class="rounded-md bg-emerald-50 text-emerald-800 px-4 py-2 text-sm">
      Saved successfully.
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading…</div>

    <form v-else class="grid gap-6 lg:grid-cols-2" @submit.prevent="onSave">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Kim's Frisør"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Street</label>
          <input
            v-model="form.street"
            type="text"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Street 1"
          />
        </div>

        <div class="grid grid-cols-[1.2fr_2fr] gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Postal code</label>
            <input
              v-model="form.postalCode"
              type="text"
              maxlength="4"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="6700"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input
              v-model="form.city"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Esbjerg"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone</label>
            <input
              v-model="form.phoneNumber"
              type="text"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="+45 00 00 00 00"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="hello@kimsfrisor.dk"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Short text about the barbershop, vibe, services…"
          />
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-900 disabled:opacity-60"
            :disabled="saving"
          >
            <span v-if="saving">Saving…</span>
            <span v-else>Save changes</span>
          </button>
        </div>
      </div>
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
      return t === "" ? null : t;
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
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      'Failed to save barber shop.';
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>
