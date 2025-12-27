<script setup lang="ts">
import type { Service } from '@/types';
defineProps<{ service: Service; onSelect?: (s: Service) => void }>();
</script>

<template>
  <div class="card p-4 flex items-center justify-between">
    <div>
      <div class="font-medium">{{ service.name }}</div>
      <div class="text-sm text-zinc-600">{{ service.durationMin }} min</div>
    </div>
    <div class="flex items-center gap-3">
      <div class="font-semibold">{{ (service.priceCents / 100).toFixed(2) }} kr</div>
      <button class="btn btn-ghost" @click="onSelect?.(service)">Choose</button>
    </div>
  </div>
</template>
