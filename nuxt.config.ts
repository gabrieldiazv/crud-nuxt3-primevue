// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  primevue: {
    usePrimeVue: true,
    options: {},
    importPT: undefined,
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    components: {
      include: '*'
    },

  },
  css: ['@/assets/styles.scss',"primeicons/primeicons.css"],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:6868/api',
    },
  },
  plugins: [
    '~/plugins/useEmitter',
  ]
})
