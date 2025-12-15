<template>
  <Hero /><ServicesSection />
  <BookingSection />
  <GallerySection />
  <OpeningHoursSection />
  <ContactSection />
</template>

<script setup lang="ts">
import Hero from '@/modules/public/components/Hero.vue';
import ServicesSection from '@/modules/public/sections/ServicesSection.vue';
import BookingSection from '@/modules/public/sections/BookingSection.vue';
import GallerySection from '@/modules/public/sections/GallerySection.vue';
import ContactSection from '@/modules/public/sections/ContactSection.vue';
import OpeningHoursSection from '@/modules/public/sections/OpeningHoursSection.vue';
</script>
