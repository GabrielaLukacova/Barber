<template>
  <div class="min-h-screen bg-zinc-100 text-zinc-900 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-2xl">
      <div
        class="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur shadow-sm p-6 sm:p-8"
      >
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold tracking-tight">Edit service</h1>
          <RouterLink
            :to="{ name: 'admin-services' }"
            class="text-sm text-zinc-600 hover:underline"
          >
            ← Back to list
          </RouterLink>
        </div>

        <div
          v-if="error"
          class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <form @submit.prevent="onSubmit" class="mt-6 space-y-4" v-if="service && loaded">
          <div>
            <label class="block text-sm font-semibold text-zinc-700 mb-1">Name</label>
            <input
              v-model="name"
              type="text"
              class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
              required
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-zinc-700 mb-1">Duration (min)</label>
              <input
                v-model.number="duration"
                type="number"
                min="1"
                class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-zinc-700 mb-1">Price (DKK)</label>
              <input
                v-model.number="price"
                type="number"
                min="0"
                class="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300"
                required
              />
            </div>
          </div>

          <label class="inline-flex items-center gap-2 text-sm text-zinc-700">
            <input
              id="isBooked"
              v-model="isBooked"
              type="checkbox"
              class="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-300"
            />
            <span>Currently bookable</span>
          </label>

          <div class="space-y-2">
            <div>
              <label class="block text-sm font-semibold text-zinc-700 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="block w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div class="flex items-center gap-3">
              <span class="text-sm text-zinc-600">Current image:</span>
              <img
                v-if="service?.imagePath"
                :src="getImageUrl(service.imagePath)"
                alt="Service"
                class="h-12 w-12 object-cover rounded-xl border border-zinc-200"
              />
              <span v-else class="text-xs text-zinc-500">No image</span>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-2 inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {{ loading ? 'Saving…' : 'Update service' }}
          </button>
        </form>

        <div v-else class="mt-6 text-zinc-600">Loading…</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from "../../../shared/utils/getImageUrl";
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useServiceStore } from '../stores/serviceStore';

const route = useRoute();
const router = useRouter();
const serviceStore = useServiceStore();

const id = Number(route.params.id);

const loading = computed(() => serviceStore.loading);
const error = computed(() => serviceStore.error);
const service = computed(() => serviceStore.selectedService);

const name = ref('');
const duration = ref<number | null>(null);
const price = ref<number | null>(null);
const isBooked = ref(false);
const imageFile = ref<File | null>(null);
const loaded = ref(false);

onMounted(async () => {
  try {
    await serviceStore.fetchServiceById(id);
    if (service.value) {
      name.value = service.value.name;
      duration.value = service.value.duration;
      price.value = service.value.price / 100;
      isBooked.value = service.value.isBooked;
    }
    loaded.value = true;
  } catch {
    loaded.value = true;
  }
});

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  imageFile.value = file;
}

async function onSubmit() {
  if (!service.value || duration.value == null || price.value == null) return;

  try {
    await serviceStore.updateService({
      serviceID: service.value.serviceID,
      name: name.value.trim(),
      duration: duration.value,
      price: price.value * 100,
      isBooked: isBooked.value,
      imageFile: imageFile.value,
    });

    router.push({ name: 'admin-services' });
  } catch {
    // error in store
  }
}
</script>
