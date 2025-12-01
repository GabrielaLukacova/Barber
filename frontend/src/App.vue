<template>
  <div class="min-h-screen flex flex-col">
    <MainNav />
    <main class="flex-1">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import MainNav from './components/MainNav.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>