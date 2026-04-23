import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/sandbox/',
  plugins: [react()],
  build: {
    rollupOptions: {
      cache: false,
    },
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.API_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
