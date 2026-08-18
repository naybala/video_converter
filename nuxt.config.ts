// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: false },

  // COOP/COEP headers are required for SharedArrayBuffer, which FFmpeg.wasm uses
  // internally for audio/video processing. Without these headers, the Blob URLs
  // created from FFmpeg output may fail to play in some browsers.
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp'
        }
      }
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    },
    // Required for FFmpeg.wasm WebAssembly loading in dev mode
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  },

  app: {
    head: {
      title: 'WebM to MP4 Converter — Privacy-First Browser Converter',
      meta: [
        { name: 'description', content: 'Convert WebM videos to MP4 format locally in your browser with FFmpeg.wasm. Fast, free, and 100% private.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap' }
      ]
    }
  },

  compatibilityDate: '2025-01-01'
})
