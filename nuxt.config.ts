export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/google-fonts', 'nuxt-skill-hub', '@vite-pwa/nuxt'],

  ssr: false,

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Pomodear',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'A cozy Pomodoro timer with ambient sounds, music playback, task tracking, and daily notes — stay focused in style.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://pomodear.pages.dev' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  googleFonts: {
    families: {
      'Fraunces': { wght: [400, 500, 600], ital: [400] },
      'Plus Jakarta Sans': [400, 500, 600],
      'Space Mono': [400]
    },
    display: 'swap',
    preconnect: true,
    subsets: ['latin']
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Pomodear',
      short_name: 'Pomodear',
      description: 'A cozy, customizable productivity workspace.',
      start_url: '/',
      display: 'standalone',
      background_color: '#1A1916',
      theme_color: '#E08228',
      icons: [
        { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
      ],
      screenshots: [
        { src: '/screenshot-wide.jpg', sizes: '1869x907', type: 'image/jpeg', form_factor: 'wide' },
        { src: '/screenshot-narrow.jpg', sizes: '425x720', type: 'image/jpeg', form_factor: 'narrow' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      globIgnores: ['audio/**', 'images/**'],
      navigateFallback: '/',
      runtimeCaching: [
        {
          urlPattern: /\/audio\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio-cache',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            rangeRequests: true
          }
        },
        {
          urlPattern: /\/images\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    }
  },

  skillHub: {
    targets: ['claude-code'],
    generationMode: 'prepare'
  }
})
