import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import mpa from "vite-plugin-mpa"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

const isTest = process.env.TEST === "true"
console.log("isTest=>", isTest)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
    }),
    // @ts-expect-error
    mpa.default(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 浏览器兼容性 ‘esnext’ | 'modules'
    target: "modules",
  },
})
