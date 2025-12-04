<script setup lang="ts">
import { ref } from 'vue';
import { login } from '@/modules/admin/auth/authApi';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  try {
    loading.value = true;
    error.value = null;

    await login({
      username: username.value,
      password: password.value,
    });

    // After successful login, go to admin dashboard
    window.location.href = '/admin/services'; // or router.push('/admin/services')
  } catch (e: any) {
    error.value = e.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
