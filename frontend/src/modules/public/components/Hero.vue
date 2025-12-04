<template>
  <section class="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-zinc-900">
    <img
      src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1920&auto=format&fit=crop"
      alt="Barbershop"
      class="absolute inset-0 h-full w-full object-cover opacity-70"
    />
    <div class="relative z-10 flex h-full w-full items-center justify-center">
      <div class="text-center text-white max-w-xl mx-auto px-4">
        <p class="text-sm uppercase tracking-[0.3em] text-zinc-300">
          Esbjerg · Since 1998
        </p>
        <h1 class="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Kim’s Frisør
        </h1>
        <p class="mt-3 text-zinc-200">
          Modern cuts with a cozy vintage barbershop vibe.
        </p>
        <div class="mt-6 flex items-center justify-center gap-4">
          <RouterLink
            to="/booking"
            class="btn-primary"
          >
            Book tid
          </RouterLink>
          <RouterLink
            to="/services"
            class="btn-ghost"
          >
            Se priser
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
