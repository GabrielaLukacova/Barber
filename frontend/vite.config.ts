import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5178, // or whatever Vite is using, doesn't really matter
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend
        changeOrigin: true,
      },
    },
  },
});
