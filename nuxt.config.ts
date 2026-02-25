export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/google-fonts'
  ],

  ssr: false,

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Pomodear',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'A cozy Pomodoro timer with ambient sounds, music playback, task tracking, and daily notes — stay focused in style.' },
        { name: 'theme-color', content: '#E08228' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://pomodear.pages.dev' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },

  compatibilityDate: '2025-01-15',

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
  }
})
