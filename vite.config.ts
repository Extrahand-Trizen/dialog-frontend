import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset URLs so MinIO subfolder hosting (.../latest/index.html) works
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//,
              priority: 30,
            },
            {
              name: 'tanstack',
              test: /node_modules\/@tanstack\//,
              priority: 25,
            },
            {
              name: 'radix',
              test: /node_modules\/@radix-ui\//,
              priority: 20,
            },
            {
              name: 'forms',
              test: /node_modules\/(react-hook-form|@hookform\/resolvers|zod)\//,
              priority: 15,
            },
            {
              name: 'icons',
              test: /node_modules\/lucide-react\//,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
