<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { AdminGalleryApi, type GalleryImageDto } from '@/modules/admin/api/AdminGalleryApi';

const API_URL = (import.meta.env.VITE_API_URL as string).replace(/\/+$/, '');
const fullSrc = (p: string) => `${API_URL}${p.startsWith('/') ? '' : '/'}${p}`;

const loading = ref(false);
const error = ref<string | null>(null);
const images = ref<GalleryImageDto[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const sorted = computed(() =>
  [...images.value].sort((a, b) => a.sortOrder - b.sortOrder || a.imageID - b.imageID),
);

async function refresh() {
  loading.value = true;
  error.value = null;
  try {
    images.value = await AdminGalleryApi.list();
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Failed to load gallery';
  } finally {
    loading.value = false;
  }
}

async function onPickFiles(ev: Event) {
  const target = ev.target as HTMLInputElement;
  const files = Array.from(target.files ?? []);
  if (!files.length) return;

  loading.value = true;
  error.value = null;
  try {
    images.value = await AdminGalleryApi.upload(files);
    if (fileInput.value) fileInput.value.value = '';
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Upload failed';
  } finally {
    loading.value = false;
  }
}

async function swap(idxA: number, idxB: number) {
  const arr = sorted.value;
  if (!arr[idxA] || !arr[idxB]) return;

  const a = arr[idxA];
  const b = arr[idxB];

  await AdminGalleryApi.setSortOrder(a.imageID, b.sortOrder);
  await AdminGalleryApi.setSortOrder(b.imageID, a.sortOrder);
  await refresh();
}

async function del(id: number) {
  if (!confirm('Delete this image?')) return;

  loading.value = true;
  error.value = null;
  try {
    await AdminGalleryApi.remove(id);
    await refresh();
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? e?.message ?? 'Delete failed';
  } finally {
    loading.value = false;
  }
}

onMounted(refresh);
</script>


<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">Gallery</h1>
        <p class="text-slate-500">Upload, reorder, delete</p>
      </div>

      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="block"
        @change="onPickFiles"
      />
    </div>

    <p v-if="error" class="text-red-600">{{ error }}</p>
    <p v-if="loading" class="text-slate-500">Working…</p>

    <div v-if="sorted.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <div v-for="(img, idx) in sorted" :key="img.imageID" class="rounded-lg border bg-white overflow-hidden">
        <div class="aspect-square bg-slate-100">
          <img :src="fullSrc(img.filePath)" class="w-full h-full object-cover" alt="" />
        </div>

        <div class="p-2 flex items-center justify-between gap-2">
          <div class="text-xs text-slate-500">#{{ img.sortOrder }}</div>

          <div class="flex items-center gap-1">
            <button class="px-2 py-1 border rounded" :disabled="idx===0 || loading" @click="swap(idx, idx-1)">Up</button>
            <button class="px-2 py-1 border rounded" :disabled="idx===sorted.length-1 || loading" @click="swap(idx, idx+1)">Down</button>
            <button class="px-2 py-1 border rounded text-red-600" :disabled="loading" @click="del(img.imageID)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-slate-500">No images yet. Choose files to upload.</p>
  </div>
</template>
