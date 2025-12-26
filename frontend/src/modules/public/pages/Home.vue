<template>
  <Hero /><ServicesSection />
  <BookingSection />
  <GallerySection />
  <TimeOffSection />
  <HoursContactSection />
</template>

<script setup lang="ts">
import Hero from '@/modules/public/components/Hero.vue';
import ServicesSection from '@/modules/public/sections/ServicesSection.vue';
import BookingSection from '@/modules/public/sections/BookingSection.vue';
import GallerySection from '@/modules/public/sections/GallerySection.vue';
import TimeOffSection from '@/modules/public/sections/TimeOffSection.vue';
import HoursContactSection from '@/modules/public/sections/HoursContactSection.vue';
</script>
