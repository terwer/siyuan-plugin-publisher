import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  base: "",
  build: {
    target: "esnext",
    minify: "terser",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue"],
          core: ["@siyuan-publisher/core"],
          ui: ["@siyuan-publisher/ui"],
          "plugin-system": ["@siyuan-publisher/plugin-system"],
          "platform-adaptors": ["@siyuan-publisher/platform-adaptors"],
        },
      },
    },
  },
})
