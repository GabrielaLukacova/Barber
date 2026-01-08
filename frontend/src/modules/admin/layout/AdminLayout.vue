<template>
  <div class="admin-root">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <h1 class="admin-brand__title">Barber Admin Panel</h1>
        <div class="admin-brand__rule"></div>
      </div>

      <!-- Nav (CSS) -->
      <nav class="admin-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.namePrefix"
          :to="item.to"
          class="admin-nav__link"
          :class="{ 'is-active': route.name && route.name.toString().startsWith(item.namePrefix) }"
        >
          <span class="material-icons-outlined admin-nav__icon" aria-hidden="true">
            {{ item.icon }}
          </span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <!-- Logout (CSS) -->
      <div class="admin-logout">
        <button type="button" @click="onLogout" class="admin-logout__btn">
          <span class="material-icons-outlined" style="font-size: 16px">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <div class="admin-container">
        <div class="admin-surface">
          <RouterView />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
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
    namePrefix: 'admin-gallery',
    label: 'Gallery',
    to: { name: 'admin-gallery' },
    icon: 'photo_library',
  },
  { namePrefix: 'admin-shop', label: 'Barber Shop', to: { name: 'admin-shop' }, icon: 'store' },
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

onMounted(() => {
  document.documentElement.classList.remove('dark');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>