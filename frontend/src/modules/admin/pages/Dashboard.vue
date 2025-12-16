<template>
  <div class="min-h-screen bg-slate-900 text-slate-50 p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Welcome to the Barber Admin Panel</h1>
      <p class="mt-2 text-slate-400">
        Manage appointments, services, clients, gallery, and opening hours from one place.
      </p>
    </header>

    <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <RouterLink
        :to="{ name: 'admin-appointments' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">event</span>
          Appointments
        </h2>
        <p class="mt-2 text-slate-400">
          View and manage upcoming bookings in your calendar.
        </p>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-services' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">content_cut</span>
          Services
        </h2>
        <p class="mt-2 text-slate-400">
          Edit haircut types, durations, and prices.
        </p>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-clients' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">people</span>
          Clients
        </h2>
        <p class="mt-2 text-slate-400">
          See client details and notes from appointments.
        </p>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-gallery' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">photo_library</span>
          Gallery
        </h2>
        <p class="mt-2 text-slate-400">
          Update portfolio photos from the GalleryImage table.
        </p>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-hours' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">schedule</span>
          Opening Hours
        </h2>
        <p class="mt-2 text-slate-400">
          Edit shop_opening_hours (OpeningHours table).
        </p>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin-timeoff' }"
        class="block rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:bg-slate-700 transition"
      >
        <h2 class="text-xl font-semibold flex items-center gap-2">
          <span class="material-icons-outlined text-base">beach_access</span>
          Time Off
        </h2>
        <p class="mt-2 text-slate-400">
          Manage TimeOff periods when booking is disabled.
        </p>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>
