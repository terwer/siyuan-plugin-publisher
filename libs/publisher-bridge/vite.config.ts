/// <reference types="vitest" />

import { resolve } from "path"
import { defineConfig } from "vite"
import minimist from "minimist"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w
const devDistDir = "/Users/terwer/Documents/mydocs/SiYuanWorkspace/public/data/plugins/siyuan-publisher/lib/bridge"
const distDir = isWatch ? devDistDir : "./dist"

export default defineConfig({
  plugins: [],

  build: {
    // 输出路径
    outDir: distDir,

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
    },
    commonjsOptions: {
      include: [],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      platform: "node",
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
