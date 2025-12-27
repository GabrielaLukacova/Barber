<template>
  <footer class="mt-0 border-t border-white/10 bg-black text-zinc-200">
    <div class="section-block">
      <div class="mx-auto max-w-6xl">
        <div class="flex flex-col items-center gap-6 text-center">
          <div class="text-base font-semibold tracking-tight text-white">
            {{ shopName }}
          </div>

          <div
            class="flex flex-wrap items-center justify-center gap-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-zinc-300/80"
          >
            <span class="inline-flex items-center gap-2">
              <span class="h-px w-8 bg-[#C7A47D]/70"></span><span>Fades</span>
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-px w-8 bg-[#C7A47D]/70"></span><span>Beards</span>
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="h-px w-8 bg-[#C7A47D]/70"></span><span>Line-ups</span>
            </span>
          </div>

          <p class="max-w-2xl text-sm text-zinc-400">
            Crafted cuts. Clean details. A calm place to reset your style.
          </p>

          <div class="h-px w-full max-w-xl bg-white/10"></div>

          <div class="text-xs text-zinc-500">
            <span class="text-[#C7A47D]">●</span>
            <span class="ml-2">© 2025 {{ shopName }}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

interface BarberShopDto {
  barberShopID: number;
  name: string;
}

const shop = ref<BarberShopDto | null>(null);
const shopName = computed(() => shop.value?.name ?? "Kim's Frisør");

async function loadShopName() {
  try {
    const apiBase = import.meta.env.VITE_API_URL;
    const res = await axios.get<BarberShopDto[]>(`${apiBase}/api/barber-shops`);
    shop.value = res.data?.[0] ?? null;
  } catch (_err) {
    console.error('Failed to load barber shop name for footer:', _err);
  }
}

onMounted(loadShopName);
</script>
