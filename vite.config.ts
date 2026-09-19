import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // Use relative asset URLs so the Vite build works reliably on the
  // GitHub Pages project URL as well as local hosting.
  base: './',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
