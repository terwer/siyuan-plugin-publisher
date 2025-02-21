// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: "cloudflare_pages",
  },

  compatibilityDate: "2024-11-01"
})
