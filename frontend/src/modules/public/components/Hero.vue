<template>
  <section class="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-zinc-900">
    <img
      src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1920&auto=format&fit=crop"
      alt="Barber working on a men's haircut"
      class="absolute inset-0 h-full w-full object-cover opacity-70"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-900/50 to-zinc-900/10"></div>

    <div class="relative z-10 flex h-full w-full items-center justify-center">
      <div class="text-center text-white max-w-xl  px-0">
        <p class="text-xs sm:text-sm uppercase tracking-[0.35em] text-zinc-300">
          {{ cityLabel }} · Since 1998
        </p>
        <h1 class="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
          {{ shopName }}
        </h1>
        <p class="mt-4 text-sm sm:text-base text-zinc-200">
          {{ heroDescription }}
        </p>
        <div class="mt-8 flex items-center justify-center">
          <RouterLink
            to="/booking"
            class="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-wide shadow-lg
                   bg-[#C7A47D] text-zinc-900 hover:bg-[#b08f69] transition duration-200
                   hover:-translate-y-0.5 active:translate-y-0"
          >
            Book tid
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
  phoneNumber: string | null;
  email: string | null;
  street: string | null;
  postalCode: string | null;
  description: string | null;
  city: string | null;
}

const shop = ref<BarberShopDto | null>(null);

const shopName = computed(() => shop.value?.name ?? "Kim's Frisør");

const heroDescription = computed(() => {
  const d = shop.value?.description?.trim();
  return d && d.length > 0
    ? d
    : "Modern cuts with a cozy vintage barbershop vibe.";
});

const cityLabel = computed(() => {
  if (shop.value?.city && shop.value.city.trim().length > 0) return shop.value.city;
  return "Esbjerg";
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

onMounted(() => {
  loadShop();
});
</script>
