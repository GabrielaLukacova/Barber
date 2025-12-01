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

    <div class="text-center">
      <RouterLink to="/services" class="btn btn-primary">See services & prices</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import Hero from '@/components/Hero.vue';
</script>