import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@terwer/ui": resolve(__dirname, "src"),
      "@terwer/ui/styles": resolve(__dirname, "src/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      stylus: {
        imports: [resolve(__dirname, "src/styles/base/variables.styl")],
      },
    },
  },
  server: {
    open: true,
  },
})
