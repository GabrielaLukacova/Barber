<template>
  <div class="min-h-screen flex bg-slate-900 text-slate-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div class="px-5 py-4 border-b border-slate-800">
        <h1 class="text-lg font-semibold tracking-wide text-center">
          Barber Admin Panel
        </h1>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.namePrefix"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                 text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition"
          :class="{
            'bg-slate-800 text-slate-50':
              route.name && route.name.toString().startsWith(item.namePrefix),
          }"
        >
          <span class="material-icons-outlined text-base" aria-hidden="true">
            {{ item.icon }}
          </span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="px-3 pb-4 pt-2 border-t border-slate-800">
        <button
          type="button"
          @click="onLogout"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                 text-sm font-medium bg-red-500 text-slate-50 hover:bg-red-400 transition"
        >
          <span class="material-icons-outlined text-base">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 min-h-screen bg-slate-900 p-6 text-slate-900 bg-white p-6 text-slate-900 bg-white p-6 text-slate-900 bg-white">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const navItems = [
  {
    namePrefix: 'admin-dashboard',
    label: 'Dashboard',
    to: { name: 'admin-dashboard' },
    icon: 'dashboard',
  },
  {
    namePrefix: 'admin-appointments',
    label: 'Appointments',
    to: { name: 'admin-appointments' },
    icon: 'event',
  },
  {
    namePrefix: 'admin-services',
    label: 'Services',
    to: { name: 'admin-services' },
    icon: 'content_cut',
  },
  {
    namePrefix: 'admin-clients',
    label: 'Clients',
    to: { name: 'admin-clients' },
    icon: 'people',
  },
  {
    namePrefix: 'admin-gallery',
    label: 'Gallery',
    to: { name: 'admin-gallery' },
    icon: 'photo_library',
  },
  {
    namePrefix: 'admin-shop',
    label: 'Barber Shop',
    to: { name: 'admin-shop' },
    icon: 'store',
  },
  {
    namePrefix: 'admin-hours',
    label: 'Opening Hours',
    to: { name: 'admin-hours' },
    icon: 'schedule',
  },
  {
    namePrefix: 'admin-timeoff',
    label: 'Time Off',
    to: { name: 'admin-timeoff' },
    icon: 'beach_access',
  },
];

async function onLogout() {
  auth.logout();
  await router.push({ name: 'admin-login' });
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>
