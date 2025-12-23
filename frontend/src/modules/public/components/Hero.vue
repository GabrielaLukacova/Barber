<template>
  <section id="hero" class="relative -mt-16 h-[92vh] w-full overflow-hidden bg-zinc-950">
    <img
      src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1920&auto=format&fit=crop"
      alt="Barber working on a men's haircut"
      class="absolute inset-0 h-full w-full object-cover opacity-60"
    />

    <!-- cinematic dark overlay (keeps text readable) -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10"></div>

    <!-- NATURAL FADE TO WHITE (starts around mid image, very smooth) -->
    <!-- NATURAL FADE (light -> white, dark -> zinc-950) -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white dark:via-zinc-950/15 dark:to-zinc-950"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-white/35 blur-3xl dark:bg-zinc-950/55"></div>

    <div class="relative z-10 h-full w-full flex items-center justify-center">
      <div class="section-block w-full text-center text-white">
        <p class="text-[11px] sm:text-xs uppercase tracking-[0.42em] text-white/75">
          {{ cityLabel }}
        </p>

        <h1 class="font-barber mt-3 text-6xl sm:text-7xl md:text-8xl leading-[0.92] tracking-[-0.02em]">
          {{ shopName }}
        </h1>

        <p class="mt-4 mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/85 leading-relaxed">
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

interface BarberShopDto {
  barberShopID: number;
  name: string;
  city: string | null;
}

const shop = ref<BarberShopDto | null>(null);

const shopName = computed(() => shop.value?.name ?? "Kim's Frisør");
const cityLabel = computed(() => shop.value?.city?.trim() || 'Esbjerg');

const heroDescription = computed(() => {
  return "Looking your best never goes out of style.";
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
