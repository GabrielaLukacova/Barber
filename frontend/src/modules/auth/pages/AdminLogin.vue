<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900">
    <div class="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg p-8 border border-slate-700">
      <h1 class="text-2xl font-semibold text-center mb-6 text-slate-50">Barber Admin Login</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1" for="username">
            Username
          </label>
          <input
            id="username"
            v-model.trim="form.username"
            type="text"
            required
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1" for="password">
            Password
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <p v-if="error" class="text-sm text-red-400">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-2 inline-flex justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <span v-if="!loading">Login</span>
          <span v-else>Logging in…</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({
  username: '',
  password: '',
});

const error = ref<string | null>(null);
const loading = ref(false);

async function onSubmit() {
  error.value = null;
  loading.value = true;

  try {
    await auth.login({ ...form });

    const redirect = (route.query.redirect as string) || '/admin';
    await router.push(redirect);
  } catch (err: any) {
    error.value = err?.message ?? 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>