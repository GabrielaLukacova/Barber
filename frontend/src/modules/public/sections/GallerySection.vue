<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import api from '@/services/api';

type GalleryImageDto = {
  imageID: number;
  barberShopID: number;
  filePath: string;
  sortOrder: number;
};

const API_URL = (import.meta.env.VITE_API_URL as string).replace(/\/+$/, '');
const fullSrc = (p: string) => `${API_URL}${p.startsWith('/') ? '' : '/'}${p}`;

const loading = ref(false);
const error = ref<string | null>(null);
const images = ref<GalleryImageDto[]>([]);

const sorted = computed(() =>
  [...images.value].sort((a, b) => a.sortOrder - b.sortOrder || a.imageID - b.imageID),
);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/gallery-images');
    images.value = res.data as GalleryImageDto[];
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Failed to load gallery';
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section id="gallery" class="section-block">
    <div class="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 class="text-3xl font-semibold text-zinc-900">Gallery</h2>
        <p class="text-zinc-600">A few looks from the shop.</p>
      </div>
    </div>

    <p v-if="error" class="text-red-600 mb-3">{{ error }}</p>
    <p v-else-if="loading" class="text-zinc-500 mb-3">Loading…</p>

    <div
      v-if="sorted.length"
      class="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      <a
        v-for="img in sorted"
        :key="img.imageID"
        :href="fullSrc(img.filePath)"
        target="_blank"
        rel="noreferrer"
        class="block overflow-hidden"
        title="Open image"
      >
        <div class="aspect-square bg-zinc-100">
          <img
            :src="fullSrc(img.filePath)"
            class="w-full h-full object-cover block"
            loading="lazy"
            alt="Gallery image"
          />
        </div>
      </a>
    </div>

    <p v-else-if="!loading" class="text-zinc-500">No images yet.</p>
  </section>
</template>