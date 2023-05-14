/// <reference types="vitest" />

import { resolve } from "path"
import { defineConfig } from "vite"
import minimist from "minimist"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w
const devDistDir = "/Users/terwer/Documents/mydocs/siyuan-widgets/sy-post-publisher/public/lib"
const distDir = isWatch ? devDistDir : "./dist"

export default defineConfig({
  build: {
    // 输出路径
    outDir: distDir,

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/siyuanhook.ts"),
      // the proper extensions will be added
      fileName: "siyuanhook",
      formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        entryFileNames: "[name].js",
      },
    },
    minify: false,
  },

  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
})
