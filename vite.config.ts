import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dataDirectory } from './build/data-directory';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), dataDirectory({ source: 'data', route: '/data' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Vendors change far less often than lab content, so give them their
        // own long-lived cache entries.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('i18next')) return 'i18n';
          if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
          return 'react';
        },
      },
    },
  },
});
