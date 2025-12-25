<template>
  <div id="contact" class="w-full">
    <p class="text-[14px] uppercase tracking-[0.18em] text-zinc-400 text-center">
      Contact
    </p>

    <!-- 3 vertical cards -->
    <div class="mt-10 grid gap-6">
      <!-- PHONE -->
      <a
        v-if="phoneLabel"
        :href="`tel:${phoneHref}`"
        class="group block border border-white/10 p-6 transition-colors hover:border-[#C7A47D]/60"
      >
        <div class="flex items-start gap-4">
          <svg
            viewBox="0 0 24 24"
            class="h-6 w-6 text-[#C7A47D] shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.5 5.8c0-1 .8-1.8 1.8-1.8h2.1c.8 0 1.5.5 1.7 1.2l.7 2.4c.2.7 0 1.4-.6 1.8l-1.2.9a14.5 14.5 0 0 0 6.4 6.4l.9-1.2c.4-.6 1.1-.8 1.8-.6l2.4.7c.7.2 1.2.9 1.2 1.7v2.1c0 1-.8 1.8-1.8 1.8h-1.2C9.2 22.4 2.5 15.8 2.5 7V5.8Z"
            />
          </svg>

          <div class="min-w-0">
            <div class="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Call us
            </div>
            <div class="mt-2 text-base sm:text-lg font-semibold text-zinc-50 break-words">
              {{ phoneLabel }}
            </div>
          </div>
        </div>
      </a>

      <!-- EMAIL -->
      <a
        v-if="emailLabel"
        :href="`mailto:${emailLabel}`"
        class="group block border border-white/10 p-6 transition-colors hover:border-[#C7A47D]/60"
      >
        <div class="flex items-start gap-4">
          <svg
            viewBox="0 0 24 24"
            class="h-6 w-6 text-[#C7A47D] shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 6.5h15A2 2 0 0 1 21.5 8.5v9A2 2 0 0 1 19.5 19.5h-15A2 2 0 0 1 2.5 17.5v-9A2 2 0 0 1 4.5 6.5Z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="m4 8 8 6 8-6" />
          </svg>

          <div class="min-w-0">
            <div class="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Email
            </div>
            <div class="mt-2 text-base sm:text-lg font-semibold text-zinc-50 break-words">
              {{ emailLabel }}
            </div>
          </div>
        </div>
      </a>

      <!-- ADDRESS -->
      <div class="border border-white/10 p-6">
        <div class="flex items-start gap-4">
          <svg
            viewBox="0 0 24 24"
            class="h-6 w-6 text-[#C7A47D] shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 10.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z"
            />
          </svg>

          <div class="min-w-0">
            <div class="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              Visit
            </div>
            <div class="mt-2 text-base sm:text-lg font-semibold text-zinc-50 break-words">
              {{ addressLine || 'Address not set yet' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- subtle barber accent -->
    <div class="mt-10 h-px w-full bg-gradient-to-r from-transparent via-[#C7A47D]/55 to-transparent"></div>
  </div>
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
  loadShop().catch((err) =>
    console.error('Failed to load barber shop for contact section:', err),
  );
});
</script>