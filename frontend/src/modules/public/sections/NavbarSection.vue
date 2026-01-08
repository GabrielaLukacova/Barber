<template>
  <!-- NAVBAR overlays hero (no space taken) -->
  <header :class="headerClass">
    <nav
      class="section-block flex items-center"
      style="padding-top: clamp(24px, 3vw, 32px); padding-bottom: clamp(24px, 3vw, 32px)"
    >
      <!-- LEFT: Brand -->
      <button
        type="button"
        class="text-base sm:text-lg font-semibold tracking-tight transition-colors"
        :class="brandClass"
        @click="scrollTop"
      >
        {{ shopName }}
      </button>

      <!-- RIGHT: Desktop links -->
      <div
        class="ml-auto hidden items-center gap-12 text-[15px] font-semibold uppercase tracking-[0.14em] md:flex"
        :class="navTextClass"
      >
        <button
          type="button"
          class="transition-colors hover:opacity-100"
          :class="linkClass"
          @click="onNavClick('services')"
        >
          Services
        </button>
        <button
          type="button"
          class="transition-colors hover:opacity-100"
          :class="linkClass"
          @click="onNavClick('booking')"
        >
          Booking
        </button>
        <button
          type="button"
          class="transition-colors hover:opacity-100"
          :class="linkClass"
          @click="onNavClick('gallery')"
        >
          Gallery
        </button>
        <button
          type="button"
          class="transition-colors hover:opacity-100"
          :class="linkClass"
          @click="onNavClick('opening-hours')"
        >
          Opening hours
        </button>
        <button
          type="button"
          class="transition-colors hover:opacity-100"
          :class="linkClass"
          @click="onNavClick('contact')"
        >
          Contact
        </button>
      </div>

      <!-- Mobile hamburger -->
      <button
        type="button"
        class="ml-auto inline-flex md:hidden items-center justify-center"
        :class="afterHero ? 'text-zinc-200' : 'text-white/90'"
        aria-label="Open menu"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        @click="toggleMenu"
      >
        <span class="relative block h-5 w-7">
          <span
            class="absolute left-0 top-0 h-[2px] w-7 bg-current transition-transform duration-200"
            :class="menuOpen ? 'translate-y-[9px] rotate-45' : ''"
          ></span>
          <span
            class="absolute left-0 top-[9px] h-[2px] w-7 bg-current transition-opacity duration-200"
            :class="menuOpen ? 'opacity-0' : 'opacity-100'"
          ></span>
          <span
            class="absolute left-0 top-[18px] h-[2px] w-7 bg-current transition-transform duration-200"
            :class="menuOpen ? 'translate-y-[-9px] -rotate-45' : ''"
          ></span>
        </span>
      </button>
    </nav>

    <div
      class="md:hidden overflow-hidden transition-[max-height,opacity] duration-300"
      :class="panelClass"
      :style="panelStyle"
    >
      <div class="section-block" style="padding-top: 0; padding-bottom: 0">
        <div
          class="border border-white/10 backdrop-blur-md"
          :style="afterHero ? 'background: rgba(0,0,0,0.60);' : 'background: rgba(15,18,22,0.55);'"
        >
          <div class="py-4">
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors"
              :class="mobileLinkClass"
              @click="onNavClick('services')"
            >
              Services
            </button>
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors"
              :class="mobileLinkClass"
              @click="onNavClick('booking')"
            >
              Booking
            </button>
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors"
              :class="mobileLinkClass"
              @click="onNavClick('gallery')"
            >
              Gallery
            </button>
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors"
              :class="mobileLinkClass"
              @click="onNavClick('opening-hours')"
            >
              Opening hours
            </button>
            <button
              type="button"
              class="w-full text-left px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors"
              :class="mobileLinkClass"
              @click="onNavClick('contact')"
            >
              Contact
            </button>
          </div>

          <div class="h-px bg-[#C7A47D]/40"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
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
    console.error('Failed to load barber shop name for navbar:', _err);
  }
}

function scrollTop() {
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - 84; // navbar height
  window.scrollTo({ top: offset, behavior: 'smooth' });
}

function onNavClick(id: string) {
  closeMenu();
  // allow menu close animation to start before scrolling
  requestAnimationFrame(() => scrollToId(id));
}


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
  // Close mobile menu if user scrolls a lot
  if (menuOpen.value && window.scrollY > heroEnd.value + 200) closeMenu();
}

function onResize() {
  computeHeroEnd();
  onScroll();
  // If switching to desktop, close menu
  if (window.innerWidth >= 768) closeMenu();
}

const headerClass = computed(
  () =>
    (afterHero.value
      ? 'fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/55'
      : 'fixed top-0 left-0 right-0 z-50 border-b border-transparent bg-transparent') +
    ' transition-colors duration-300',
);

const brandClass = computed(() => 'text-white');
const navTextClass = computed(() => (afterHero.value ? 'text-zinc-200' : 'text-white/90'));
const linkClass = computed(() => 'hover:text-white opacity-95');

// --- Mobile menu state ---
const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

const panelClass = computed(() => (menuOpen.value ? 'opacity-100' : 'opacity-0'));
const panelStyle = computed(() => ({
  maxHeight: menuOpen.value ? '420px' : '0px',
}));

const mobileLinkClass = computed(() =>
  afterHero.value ? 'text-zinc-200 hover:text-white' : 'text-white/90 hover:text-white',
);

watch(afterHero, () => {
  if (menuOpen.value) closeMenu();
});

onMounted(() => {
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
</script>