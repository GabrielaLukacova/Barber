<template>
  <div class="max-w-xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
    <h2 class="text-xl font-semibold text-gray-900">Booking</h2>
    <p class="text-sm text-gray-500">
      Booking wizard placeholder – connect it later to services and time slots.
    </p>
    <div class="space-y-2">
      <label class="block text-xs font-medium text-gray-600">Name</label>
      <input
        type="text"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        placeholder="Your name"
      />
    </div>
    <div class="space-y-2">
      <label class="block text-xs font-medium text-gray-600">Email</label>
      <input
        type="email"
        class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
        placeholder="you@example.com"
      />
    </div>
    <button
      type="button"
      class="mt-2 px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800"
    >
      Submit (dummy)
    </button>
  </div>
</template>

<script setup lang="ts"></script>