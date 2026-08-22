import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load .env* for local builds; CI sets NEXT_PUBLIC_API_URL / VITE_API_URL in the job env.
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.VITE_API_URL ||
    env.NEXT_PUBLIC_API_URL ||
    env.VITE_API_URL ||
    ''
  ).trim();

  const base =
    process.env.VITE_BASE?.trim() ||
    env.VITE_BASE?.trim() ||
    '/';

  return {
    // Default `/` so deep links (/calls, /inbox) load assets from the site root.
    // Set VITE_BASE=./ only for MinIO / nested static folders.
    base,
    plugins: [react(), tailwindcss()],
    // Expose NEXT_PUBLIC_* the same way Vite exposes VITE_* (CI / shared naming)
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: {
      // Bake API URL for code that reads process.env.NEXT_PUBLIC_API_URL
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(apiUrl),
    },
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
  };
});
