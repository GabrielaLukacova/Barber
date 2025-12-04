<template>
  <div class="max-w-xl space-y-6" v-if="loaded">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Edit service</h1>
      <RouterLink
        :to="{ name: 'admin-services' }"
        class="text-sm text-gray-600 hover:underline"
      >
        ← Back to list
      </RouterLink>
    </div>

    <div v-if="error" class="p-3 rounded bg-red-100 text-red-800">
      {{ error }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4" v-if="service">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input
          v-model="name"
          type="text"
          class="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Duration (min)</label>
          <input
            v-model.number="duration"
            type="number"
            min="1"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Price (DKK)</label>
          <input
            v-model.number="price"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="isBooked"
          v-model="isBooked"
          type="checkbox"
          class="h-4 w-4"
        />
        <label for="isBooked" class="text-sm">Currently bookable</label>
      </div>

      <div class="space-y-2">
        <div>
          <label class="block text-sm font-medium mb-1">Image</label>
          <input type="file" accept="image/*" @change="onFileChange" />
        </div>

        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-500">Current image:</span>
          <img
            v-if="service?.imagePath"
            :src="service.imagePath"
            alt="Service"
            class="h-12 w-12 object-cover rounded"
          />
          <span v-else class="text-xs text-gray-400">No image</span>
        </div>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-60"
      >
        {{ loading ? 'Saving...' : 'Update service' }}
      </button>
    </form>
  </div>

  <div v-else class="text-gray-500">Loading...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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
