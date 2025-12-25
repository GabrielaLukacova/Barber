<template>
  <div class="min-h-screen bg-[#0f1216] text-zinc-100">
    <!-- Show public navbar only outside admin -->
    <NavbarSection v-if="showPublicChrome" />

    <main class="w-full space-y-0">
      <RouterView />
    </main>

    <!-- Show public footer only outside admin -->
    <FooterSection v-if="showPublicChrome" />
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import NavbarSection from '@/modules/public/sections/NavbarSection.vue';
import FooterSection from '@/modules/public/sections/FooterSection.vue';

const route = useRoute();

/**
 * Hide public navbar/footer on admin pages.
 * Adjust if your admin base path is different.
 */
const showPublicChrome = computed(() => !route.path.startsWith('/admin'));

// --- Dark mode (class strategy) ---
const isDark = ref(false);

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    isDark.value = saved === 'dark';
  } else {
    isDark.value = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
  }
  applyTheme();
}

onMounted(() => {
  initTheme();
});
</script>
