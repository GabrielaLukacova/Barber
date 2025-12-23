<template>
  <div class="min-h-screen bg-white text-zinc-900">
    <!-- NAVBAR overlays hero (no space taken) -->
    <header :class="headerClass">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-10 py-6">
        <!-- Brand (no icon) -->
        <button
          type="button"
          class="text-base sm:text-lg font-semibold tracking-tight transition-colors"
          :class="brandClass"
          @click="scrollTop"
        >
          {{ shopName }}
        </button>

        <!-- Links (bigger + readable) -->
        <div
          class="hidden items-center gap-12 text-[15px] font-semibold uppercase tracking-[0.14em] md:flex"
          :class="navTextClass"
        >
          <button type="button" class="transition-colors hover:opacity-100" :class="linkClass" @click="scrollToId('services')">
            Services
          </button>
          <button type="button" class="transition-colors hover:opacity-100" :class="linkClass" @click="scrollToId('booking')">
            Booking
          </button>
          <button type="button" class="transition-colors hover:opacity-100" :class="linkClass" @click="scrollToId('opening-hours')">
            Opening hours
          </button>
          <button type="button" class="transition-colors hover:opacity-100" :class="linkClass" @click="scrollToId('gallery')">
            Gallery
          </button>
          <button type="button" class="transition-colors hover:opacity-100" :class="linkClass" @click="scrollToId('contact')">
            Contact
          </button>
        </div>
      </nav>
    </header>

    <!-- MAIN -->
    <main class="w-full space-y-0">
      <RouterView />
    </main>

    <!-- FOOTER (dark, minimal, universal barber vibe) -->
    <footer class="mt-0 border-t border-zinc-200 bg-white text-zinc-700 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200">
      <div class="mx-auto max-w-6xl px-10 py-14">
        <div class="flex flex-col items-center gap-6 text-center">
          <div class="text-base font-semibold tracking-tight text-white">
            {{ shopName }}
          </div>

          <div class="flex flex-wrap items-center justify-center gap-6 text-[12px] font-semibold uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-300">
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

          <p class="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Crafted cuts. Clean details. A calm place to reset your style.
          </p>

          <div class="h-px w-full max-w-xl bg-zinc-200 dark:bg-white/10"></div>

          <div class="text-xs text-zinc-500 dark:text-zinc-500">
            <span class="text-[#C7A47D]">●</span>
            <span class="ml-2">© 2025 {{ shopName }}. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed, onMounted, onUnmounted, ref } from "vue";
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
  } catch (err) {
    console.error('Failed to load barber shop name for navbar:', err);
  }
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - 84; // navbar height
  window.scrollTo({ top: offset, behavior: 'smooth' });
}

/*
  IMPORTANT:
  Navbar stays "hero style" while you scroll through the hero.
  It ONLY changes once you are BELOW the hero section.
*/
const afterHero = ref(false);
const heroEnd = ref(240);

function computeHeroEnd() {
  const hero = document.getElementById('hero');
  if (!hero) {
    heroEnd.value = 240;
    return;
  }
  heroEnd.value = hero.offsetTop + hero.offsetHeight - 84;
}

function onScroll() {
  afterHero.value = window.scrollY >= heroEnd.value;
}

function onResize() {
  computeHeroEnd();
  onScroll();
}

const headerClass = computed(() =>
  (afterHero.value
    ? 'fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/82 backdrop-blur supports-[backdrop-filter]:bg-white/72'
    : 'fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent'
  ) + ' transition-colors duration-300',
);

const brandClass = computed(() => (afterHero.value ? 'text-zinc-900' : 'text-white'));
const navTextClass = computed(() => (afterHero.value ? 'text-zinc-700' : 'text-white/90'));
const linkClass = computed(() => (afterHero.value ? 'hover:text-zinc-900 opacity-95' : 'hover:text-white opacity-95'));

onMounted(() => {
  initTheme();
  loadShopName();
  computeHeroEnd();
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
});


// --- Dark mode (class strategy) ---
const isDark = ref(false);

function applyTheme() {
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    isDark.value = saved === "dark";
  } else {
    isDark.value = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  }
  applyTheme();
}

function toggleTheme() {
  isDark.value = !isDark.value;
  applyTheme();
}

</script>
