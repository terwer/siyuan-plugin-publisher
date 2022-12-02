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
    // https://github.com/IndexXuan/vite-plugin-mpa/issues/30
    // @ts-expect-error
    mpa.default(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: "sass",
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "pages/index/index.html"),
        // blog: path.resolve(__dirname, "pages/blog/index.html"),
        // detail: path.resolve(__dirname, "pages/detail/index.html"),
        // publish: path.resolve(__dirname, "pages/publish/index.html"),
      },
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
      plugins: [],
    },
  },
})
