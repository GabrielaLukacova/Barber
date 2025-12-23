<template>
  <section id="contact" class="section-block w-full py-16">
    <div class="mx-auto max-w-6xl px-4">
      <div class="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 lg:p-10">
        <header class="space-y-3 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-600">
            Contact
          </p>
          <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            Let’s get you in the chair.
          </h2>
          <p class="mx-auto max-w-xl text-sm text-zinc-600">
            Call, write or visit us. Simple, friendly, and on time.
          </p>
        </header>

        <div class="mt-10 grid gap-6 md:grid-cols-3">
          <!-- Phone -->
          <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600">
              Phone
            </div>
            <div class="mt-2 text-base font-semibold text-zinc-900">
              <a v-if="phoneLabel" :href="`tel:${phoneHref}`" class="hover:underline">
                {{ phoneLabel }}
              </a>
              <span v-else class="text-zinc-500">Not set yet</span>
            </div>
          </div>

          <!-- Email -->
          <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600">
              Email
            </div>
            <div class="mt-2 text-base font-semibold text-zinc-900">
              <a v-if="emailLabel" :href="`mailto:${emailLabel}`" class="hover:underline">
                {{ emailLabel }}
              </a>
              <span v-else class="text-zinc-500">Not set yet</span>
            </div>
          </div>

          <!-- Address -->
          <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div class="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600">
              Address
            </div>
            <div class="mt-2 text-base font-semibold text-zinc-900">
              <span v-if="addressLine">{{ addressLine }}</span>
              <span v-else class="text-zinc-500">Address not set yet</span>
            </div>
          </div>
        </div>

        <!-- subtle “barber feel” strip -->
        <div
          class="mt-10 rounded-2xl border border-zinc-200 bg-[linear-gradient(135deg,#ffffff,rgba(199,164,125,0.14),#ffffff)] p-6 text-center"
        >
          <p class="text-sm text-zinc-700">
            Walk-ins when possible. Bring a reference photo if you want — we’ll match the shape to your face.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

interface BarberShopDto {
  barberShopID: number;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  description: string | null;
}

const shop = ref<BarberShopDto | null>(null);

const phoneLabel = computed(() => (shop.value?.phoneNumber ?? '').trim());
const phoneHref = computed(() => phoneLabel.value.replace(/\s+/g, ''));
const emailLabel = computed(() => (shop.value?.email ?? '').trim());

const addressLine = computed(() => {
  const s = (shop.value?.street ?? '').trim();
  const postal = (shop.value?.postalCode ?? '').trim();
  const c = (shop.value?.city ?? '').trim();

  if (s && postal && c) return `${s}, ${postal} ${c}`;
  if (s && c) return `${s}, ${c}`;
  if (postal && c) return `${postal} ${c}`;
  if (c) return c;
  return '';
});

async function loadShop() {
  const apiBase = import.meta.env.VITE_API_URL;
  const res = await axios.get<BarberShopDto[]>(`${apiBase}/api/barber-shops`);
  shop.value = res.data?.[0] ?? null;
}

onMounted(() => {
  loadShop().catch((err) => console.error('Failed to load barber shop for contact section:', err));
});
</script>
