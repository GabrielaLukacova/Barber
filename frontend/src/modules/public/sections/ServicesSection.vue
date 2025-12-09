<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useServicesStore } from '@/stores/services';

const servicesStore = useServicesStore();

// Hardcoded backend base as fallback so images ALWAYS work
const backendBase = 'https://barber-backend-b77j.onrender.com';

function getImageUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return backendBase + path;
  return backendBase + '/' + path;
}

function formatPrice(price: number) {
  return `${price} kr`;
}

onMounted(() => {
  servicesStore.loadServices();
});

const services = computed(() => servicesStore.services);
const loading = computed(() => servicesStore.loading);
const error = computed(() => servicesStore.error);
</script>

<template>
  <section id="services" class="mx-auto max-w-6xl px-4 py-12 space-y-8">
    <header class="space-y-2 text-center">
      <h2 class="text-3xl font-semibold text-slate-900">Services & Prices</h2>
      <p class="text-sm text-slate-500">
        Choose from our most popular cuts and treatments.
      </p>
    </header>

    <p v-if="error" class="text-sm text-red-500 text-center">
      {{ error }}
    </p>

    <p v-else-if="loading" class="text-sm text-slate-500 text-center">
      Loading services…
    </p>

    <div
      v-else
      class="grid gap-5 md:grid-cols-2"
    >
      <article
        v-for="svc in services"
        :key="svc.serviceID"
        class="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex-shrink-0">
          <div
            class="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center"
          >
            <img
              v-if="svc.imagePath"
              :src="getImageUrl(svc.imagePath)"
              alt=""
              class="w-full h-full object-cover"
            />
            <span
              v-else
              class="text-xs text-slate-400"
            >
              No image
            </span>
          </div>
        </div>

        <div class="flex-1 space-y-1">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-900">
              {{ svc.name }}
            </h3>
            <span class="text-sm font-medium text-slate-800">
              {{ formatPrice(svc.price) }}
            </span>
          </div>
          <p class="text-xs text-slate-500">
            {{ svc.duration }} min
          </p>
          <p
            v-if="svc.isBooked"
            class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800"
          >
            Currently not bookable
          </p>
        </div>
      </article>

      <p
        v-if="services.length === 0"
        class="col-span-full text-center text-sm text-slate-400 mt-4"
      >
        No services are available yet. Please check back later.
      </p>
    </div>
  </section>
</template>
