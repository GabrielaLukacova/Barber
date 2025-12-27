<template>
  <section id="hero" class="relative -mt-16 w-full overflow-hidden bg-[#0f1216] min-h-[100svh]">
    <img
      :src="heroImage"
      alt="Man getting a haircut at a barber shop"
      class="absolute inset-0 h-full w-full object-cover opacity-60"
    />

    <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/15"></div>

    <div class="relative z-10 min-h-[100svh] flex items-center justify-center">
      <div class="w-full max-w-4xl px-6 text-center text-white">
        <p class="text-[11px] sm:text-l uppercase tracking-[0.42em] text-white/75">
          {{ cityLabel }}
        </p>

        <h1
          class="font-barber mt-3 text-6xl sm:text-7xl md:text-8xl leading-[0.92] tracking-[-0.02em]"
        >
          {{ shopName }}
        </h1>

        <p
          class="mt-4 mx-auto max-w-4xl text-base sm:text-lg md:text-xl text-white/85 leading-relaxed"
        >
          {{ heroDescription }}
        </p>

        <div class="mt-8 flex items-center justify-center">
          <RouterLink to="/booking" class="btn btn-primary text-base sm:text-lg px-12 py-4">
            BOOK NOW
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import heroImage from '@/assets/hero.jpg';

interface BarberShopDto {
  barberShopID: number;
  name: string;
  city: string | null;
  description: string | null; // ✅ add this
}

const shop = ref<BarberShopDto | null>(null);

const shopName = computed(() => shop.value?.name ?? "Kim's Frisør");
const cityLabel = computed(() => shop.value?.city?.trim() || 'Esbjerg');

const heroDescription = computed(() => {
  const d = shop.value?.description?.trim();
  return d && d.length > 0 ? d : 'Looking your best never goes out of style.';
});

async function loadShop() {
  try {
    const apiBase = import.meta.env.VITE_API_URL;
    const res = await axios.get<BarberShopDto[]>(`${apiBase}/api/barber-shops`);
    shop.value = res.data?.[0] ?? null;
  } catch (err) {
    console.error('Failed to load barber shop for hero:', err);
  }
}

onMounted(loadShop);
</script>
