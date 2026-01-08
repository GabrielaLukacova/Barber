<template>
  <section class="section-block" aria-label="Opening hours and contact">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-40 items-start">
      <div class="min-w-0">
        <OpeningHoursSection />
      </div>
      <div class="min-w-0">
        <ContactSection />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import OpeningHoursSection from '@/modules/public/sections/OpeningHoursSection.vue';
import ContactSection from '@/modules/public/sections/ContactSection.vue';
</script>