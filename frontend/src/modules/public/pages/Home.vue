<template>
  <Hero />
  <section class="mx-auto max-w-6xl px-4 py-12 space-y-8">
    <div class="grid md:grid-cols-3 gap-4">
      <div class="card p-6">
        <div class="font-semibold mb-1">Precision Cuts</div>
        <p class="text-sm text-zinc-600">Classic to modern styles that fit you.</p>
      </div>
      <div class="card p-6">
        <div class="font-semibold mb-1">Beard Care</div>
        <p class="text-sm text-zinc-600">Trim, shape, and finish with care.</p>
      </div>
      <div class="card p-6">
        <div class="font-semibold mb-1">Right on Time</div>
        <p class="text-sm text-zinc-600">Book online and show up — easy.</p>
      </div>
    </div>
  </section>

  <ServicesSection />
  <BookingSection />
  <GallerySection />
  <ContactSection />
</template>

<script setup lang="ts">
import Hero from '@/modules/public/components/Hero.vue';
import ServicesSection from '@/modules/public/sections/ServicesSection.vue';
import BookingSection from '@/modules/public/sections/BookingSection.vue';
import GallerySection from '@/modules/public/sections/GallerySection.vue';
import ContactSection from '@/modules/public/sections/ContactSection.vue';
</script>
