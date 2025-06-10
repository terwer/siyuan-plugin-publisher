import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { resolve } from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@siyuan-publisher/common": resolve(__dirname, "../common/src"),
      "@siyuan-publisher/core": resolve(__dirname, "../core/src"),
      "@siyuan-publisher/platform-adaptors": resolve(__dirname, "../platform-adaptors/src"),
      "@siyuan-publisher/plugin-system": resolve(__dirname, "../plugin-system/src"),
      "@terwer/ui": resolve(__dirname, "../ui/src"),
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
