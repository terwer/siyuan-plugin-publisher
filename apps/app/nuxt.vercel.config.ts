// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: "vercel"
  },

  compatibilityDate: "2024-11-01"
})
