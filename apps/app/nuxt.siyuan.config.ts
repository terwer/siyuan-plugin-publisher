// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // https://nuxt.com/docs/guide/going-further/custom-routing#hash-mode-spa
  ssr: false,
  router: {
    options: {
      hashMode: true,
    },
  },

  compatibilityDate: "2024-11-01"
})
