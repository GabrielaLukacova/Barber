<script setup lang="ts">
import BookingWizard from '@/modules/public/components/BookingWizard.vue';
</script>

<template>
  <section id="booking" class="section-block mx-auto max-w-6xl px-4 py-12 space-y-8">
    <div class="space-y-2">
      <h2 class="text-3xl font-semibold text-slate-900">Book your visit</h2>
      <p class="text-sm text-slate-500 max-w-xl">
        Choose your services, pick a date and time, and leave your contact details.
      </p>
    </div>

    <BookingWizard />
  </section>
</template>
