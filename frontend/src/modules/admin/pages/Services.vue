<template>
  <div class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Services</h1>
        <p class="text-sm text-gray-500">
          Manage services (name, image, duration, price).
        </p>
      </div>
      <button
        type="button"
        class="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800"
        @click="openCreate"
      >
        + New service
      </button>
    </header>

    <div v-if="error" class="rounded-md bg-red-50 text-red-700 px-4 py-2 text-sm">
      {{ error }}
    </div>

    <div v-if="loading" class="text-sm text-gray-500">Loading services…</div>

    <div v-else class="overflow-x-auto border rounded-lg bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase">
          <tr>
            <th class="px-4 py-2">Image</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Duration (min)</th>
            <th class="px-4 py-2">Price (DKK)</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="svc in services"
            :key="svc.serviceID"
            class="border-t last:border-b"
          >
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <div class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                  <img
                    v-if="svc.imagePath"
                    :src="getImageUrl(svc.imagePath)"
                    alt="Service image"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-[10px] text-gray-400 italic">No image</span>
                </div>
              </div>
            </td>
            <td class="px-4 py-2 font-medium text-gray-900">
              {{ svc.name }}
            </td>
            <td class="px-4 py-2 text-gray-700">
              {{ svc.duration }}
            </td>
            <td class="px-4 py-2 text-gray-700">
              {{ formatPrice(svc.price) }}
            </td>
            <td class="px-4 py-2 text-right space-x-2">
              <button
                type="button"
                class="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-50"
                @click="openEdit(svc)"
              >
                Edit
              </button>
              <button
                type="button"
                class="px-3 py-1 text-xs rounded-md border border-red-300 text-red-700 hover:bg-red-50"
                @click="onDelete(svc)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="services.length === 0">
            <td colspan="5" class="px-4 py-4 text-center text-gray-400 text-sm">
              No services yet. Click "New service" to add one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal form -->
    <div
      v-if="formVisible"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    >
      <div class="bg-white text-gray-900 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
        <header class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            {{ formMode === 'create' ? 'Add service' : 'Edit service' }}
          </h2>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            @click="closeForm"
          >
            ✕
          </button>
        </header>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              required
            />
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-600">Image</label>
            <input
              type="file"
              accept="image/*"
              :required="formMode === 'create'"
              @change="onImageChange"
              class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white text-gray-900"
            />
            <p class="text-[11px] text-gray-400">
              {{ formMode === 'create'
                ? 'Image is required.'
                : 'Leave empty to keep the current image.' }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-600">
                Duration (minutes)
              </label>
              <input
                v-model.number="form.duration"
                type="number"
                min="5"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-medium text-gray-600">
                Price (DKK)
              </label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                required
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <label class="inline-flex items-center gap-2 text-xs text-gray-700">
              <input
                v-model="form.isBooked"
                type="checkbox"
                class="rounded border-gray-300 text-black focus:ring-black"
              />
              <span>Marked as booked by default</span>
            </label>
          </div>

          <div class="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              @click="closeForm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-60"
              :disabled="saving"
            >
              {{ saving ? 'Saving…' : formMode === 'create' ? 'Create' : 'Save changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  type Service,
  type ServicePayload,
} from '@/modules/admin/services/serviceApi';

// Backend base for images (admin panel)
const backendBase = 'https://barber-backend-b77j.onrender.com';

function getImageUrl(path: string | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return backendBase + path;
  return backendBase + '/' + path;
}

const services = ref<Service[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const formVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const editingId = ref<number | null>(null);

const form = ref<ServicePayload>({
  name: '',
  duration: 30,
  price: 300,
  isBooked: false,
  imageFile: null,
});

function formatPrice(price: number) {
  return `${price} kr`;
}

async function load() {
  try {
    loading.value = true;
    error.value = null;
    services.value = await fetchServices();
  } catch (e) {
    error.value = 'Failed to load services.';
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = {
    name: '',
    duration: 30,
    price: 300,
    isBooked: false,
    imageFile: null,
  };
  editingId.value = null;
}

function openCreate() {
  formMode.value = 'create';
  resetForm();
  formVisible.value = true;
}

function openEdit(svc: Service) {
  formMode.value = 'edit';
  editingId.value = svc.serviceID;
  form.value = {
    name: svc.name,
    duration: svc.duration,
    price: svc.price,
    isBooked: svc.isBooked,
    imageFile: null,
  };
  formVisible.value = true;
}

function closeForm() {
  formVisible.value = false;
}

function onImageChange(e: Event) {
  const target = e.target as HTMLInputElement;
  form.value.imageFile = target.files?.[0] ?? null;
}

async function onSubmit() {
  try {
    error.value = null;

    if (!form.value.name.trim() || !form.value.duration || !form.value.price) {
      error.value = 'All fields are required.';
      return;
    }

    if (formMode.value === 'create' && !form.value.imageFile) {
      error.value = 'Image is required.';
      return;
    }

    saving.value = true;

    if (formMode.value === 'create') {
      await createService(form.value);
    } else if (formMode.value === 'edit' && editingId.value != null) {
      await updateService(editingId.value, form.value);
    }

    await load();
    formVisible.value = false;
  } catch (e) {
    error.value = 'Failed to save service.';
    console.error(e);
  } finally {
    saving.value = false;
  }
}

async function onDelete(svc: Service) {
  if (!confirm(`Delete service "${svc.name}"?`)) return;
  try {
    await deleteService(svc.serviceID);
    await load();
  } catch (e) {
    error.value = 'Failed to delete service.';
    console.error(e);
  }
}

onMounted(load);
</script>
