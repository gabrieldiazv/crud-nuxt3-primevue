// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    'dayjs-nuxt',
    '@vee-validate/nuxt',
  ],
  primevue: {
    usePrimeVue: true,
    options: {},
    importPT: undefined,
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    components: {
      include: '*',
      exclude: ['Editor', 'Chart']
    },

  },
  css: ['@/assets/styles.scss', "primeicons/primeicons.css"],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:6868/api',
    },
  },
  plugins: [
    '~/plugins/useEmitter',
    '~/plugins/vueLoaderOverlay',
    '~/plugins/configYup',
  ],
  dayjs: {
    locales: ['es','en'],
    plugins: ['relativeTime', 'utc', 'timezone','isBetween'],
    defaultLocale: 'es',
    // defaultTimezone santiago de chile 
    defaultTimezone: 'America/Santiago',
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },


  },
})
