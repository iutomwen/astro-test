// @ts-check
import { defineConfig } from 'astro/config';

import alpinejs from '@astrojs/alpinejs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs()],
  
  // Performance optimizations
  build: {
    inlineStylesheets: 'auto',
    assetsPrefix: '',
  },
  
  // Image optimization
  image: {
    domains: ['picsum.photos'],
  },
  
  // Prefetch optimization
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // CSS code splitting
      cssCodeSplit: true,
      // Rollup optimizations
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['alpinejs']
          }
        }
      }
    }
  }
});