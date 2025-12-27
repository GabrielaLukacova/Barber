<template>
  <div
    class="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
  >
    <div v-if="service.imagePath" class="h-40 overflow-hidden bg-gray-100">
      <img :src="service.imagePath" :alt="service.name" class="w-full h-full object-cover" />
    </div>
    <div v-else class="h-40 flex items-center justify-center bg-gray-100 text-xs text-gray-400">
      No image
    </div>

    <div class="p-4 flex-1 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-gray-900">{{ service.name }}</h3>
        <span class="text-sm font-medium text-gray-800"> {{ service.price }} kr </span>
      </div>
      <p class="text-xs text-gray-500">Duration: {{ service.duration }} minutes</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PublicService {
  serviceID: number;
  name: string;
  imagePath: string | null;
  duration: number;
  price: number;
  isBooked: boolean;
}

defineProps<{
  service: PublicService;
}>();
</script>
