export default defineNuxtConfig({
  ssr: false,

  // routeRules: {
  //   '/api/**': { cors: true },
  // },

  devtools: { enabled: true },
  typescript: { shim: false },

  nitro: { imports: { dirs: ['./server/models'] } },

  app: {
    keepalive: true,
    pageTransition: false,
    layoutTransition: false,
  },

  // spaLoadingTemplate: false,

  runtimeConfig: {
    mongodbUri: '',
    public: {
      mapboxToken: '',
    },
  },

  modules: [
    '@vueuse/nuxt',
    'nuxt-quasar-ui',
  ],

  quasar: {
    plugins: ['Dialog', 'AppFullscreen', 'Notify'],
    lang: 'fr',
    extras: {
      font: 'roboto-font',
      fontIcons: ['material-icons', 'fontawesome-v6'],
    },
    config: {
      brand: {
        primary: '#005500',
        secondary: '#26A69A',
        accent: '#dd4b39',
        dark: '#1D1D1D',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037',
      },
    },
  },
})
