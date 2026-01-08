<template>
  <div class="admin-page">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="admin-title">Services</h1>
        <p class="admin-subtitle">Manage services (name, image, duration, price).</p>
      </div>

      <button type="button" class="admin-btn admin-btn--accent" @click="openCreate">
        + New service
      </button>
    </header>

    <div v-if="error" class="admin-alert admin-alert--error">{{ error }}</div>
    <div v-if="loading" class="admin-alert">Loading services…</div>

    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="text-left">Image</th>
            <th class="text-left">Name</th>
            <th class="text-left">Duration (min)</th>
            <th class="text-left">Price (DKK)</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="svc in services" :key="svc.serviceID">
            <td>
              <div
                class="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center"
              >
                <img
                  v-if="svc.imagePath"
                  :src="getImageUrl(svc.imagePath)"
                  alt="Service image"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-[11px] text-zinc-500">No image</span>
              </div>
            </td>

            <td class="font-semibold text-zinc-900">{{ svc.name }}</td>
            <td class="text-zinc-800">{{ svc.duration }}</td>
            <td class="text-zinc-800">{{ formatPrice(svc.price) }}</td>

            <td class="text-right">
              <div class="inline-flex gap-2">
                <button type="button" class="admin-btn admin-btn--accent" @click="openEdit(svc)">
                  Edit
                </button>
                <button type="button" class="admin-btn admin-btn--danger" @click="onDelete(svc)">
                  Delete
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="services.length === 0">
            <td colspan="5" class="text-center text-zinc-600">
              No services yet. Click “New service” to add one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal kept same functionality, only style -->
    <div
      v-if="formVisible"
      class="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4"
    >
      <div
        class="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl p-6 space-y-4"
      >
        <header class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-black">
            {{ formMode === 'create' ? 'Add service' : 'Edit service' }}
          </h2>
          <button type="button" class="text-zinc-600 hover:text-zinc-900" @click="closeForm">
            ✕
          </button>
        </header>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <label class="admin-label">Name</label>
            <input v-model="form.name" type="text" class="admin-input" required />
          </div>

          <div class="space-y-2">
            <label class="admin-label">Image</label>
            <input
              type="file"
              accept="image/*"
              :required="formMode === 'create'"
              @change="onImageChange"
              class="admin-input"
            />
            <p class="admin-help">
              {{
                formMode === 'create'
                  ? 'Image is required.'
                  : 'Leave empty to keep the current image.'
              }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="admin-label">Duration (minutes)</label>
              <input
                v-model.number="form.duration"
                type="number"
                min="5"
                class="admin-input"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="admin-label">Price (DKK)</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                class="admin-input"
                required
              />
            </div>
          </div>

          <label class="inline-flex items-center gap-2 text-sm text-zinc-800">
            <input v-model="form.isBooked" type="checkbox" class="h-4 w-4" />
            <span>Marked as booked by default</span>
          </label>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="admin-btn" @click="closeForm">Cancel</button>
            <button type="submit" class="admin-btn admin-btn--accent" :disabled="saving">
              {{ saving ? 'Saving…' : formMode === 'create' ? 'Create' : 'Save changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '../../../shared/utils/getImageUrl';
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
