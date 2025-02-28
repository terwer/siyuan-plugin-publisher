// const generateDynamicV = () => {
//   const now = new Date()
//   const year = now.getFullYear().toString()
//   const month = (now.getMonth() + 1).toString().padStart(2, "0")
//   const day = now.getDate().toString().padStart(2, "0")
//   const hour = now.getHours().toString().padStart(2, "0")
//   const minute = now.getMinutes().toString().padStart(2, "0")
//   return year + month + day + hour + minute
// }

const isDev = process.env.NODE_ENV === "development"
const appBase = "/plugins/siyuan-plugin-publisher/app/"
// const staticV = generateDynamicV()

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

  vite: {
    define: {
      "process.env.DEV_MODE": `"${isDev}"`,
      "process.env.APP_BASE": `"${appBase}"`,
      "process.env.SSR": "\"false\"",
    }
  },

  app: {
    baseURL: appBase
  },

  compatibilityDate: "2024-11-01"
})
