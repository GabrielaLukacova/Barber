import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { LoginPayload } from '../services/authApi';
import { login as loginRequest } from '../services/authApi';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'));
  const username = ref<string | null>(localStorage.getItem('admin_username'));

  const isAuthenticated = computed(() => !!token.value);

  async function login(payload: LoginPayload) {
    const result = await loginRequest(payload);

    token.value = result.token;
    username.value = result.username;

    localStorage.setItem('admin_token', result.token);
    localStorage.setItem('admin_username', result.username);
  }

  function logout() {
    token.value = null;
    username.value = null;
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return {
    token,
    username,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
  };
});
