<script setup lang="ts">
import { onMounted } from 'vue';
import { useServicesStore } from '@/stores/services';
import ServiceCard from '@/components/ServiceCard.vue';
import { useBookingStore } from '@/stores/booking';
import { useRouter } from 'vue-router';

const services = useServicesStore();
const booking = useBookingStore();
const router = useRouter();

onMounted(() => services.load());
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-10 space-y-6">
    <h1 class="text-3xl font-semibold">Services & Prices</h1>
    <div v-if="services.loading" class="text-zinc-600">Loading…</div>
    <div v-else class="grid md:grid-cols-2 gap-4">
      <ServiceCard
        v-for="s in services.items"
        :key="s.id"
        :service="s"
        :onSelect="(svc)=>{ booking.reset(); booking.service=svc; booking.step=2; router.push('/booking'); }"
      />
    </div>
  </section>
</template>