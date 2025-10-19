// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Build optimization
  build: {
    // Tối ưu hóa build cho production
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  // Image optimization configuration
  image: {
    // Disable default image component optimization nếu cần custom handling
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
  },

  // Output format for Vercel
  output: 'static',

  // Site metadata for SEO
  site: 'https://asiix.vn',

  // Trailingslash behavior
  trailingSlash: 'ignore',

  // Prefetch configuration
  prefetch: {
    prefetchAll: true,
  },

  // ViteConfig cho optimization
  vite: {
    build: {
      // Tối ưu hóa bundle
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      // Rollup options
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Code splitting optimization
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
    // Image optimization
    ssr: {
      external: ['sharp'],
    },
  },

  // Integrations có thể thêm vào sau
  integrations: [],

  // Dev server config
  devToolbar: {
    enabled: true,
  },

});
