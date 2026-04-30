/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import vue from "@vitejs/plugin-vue"
import fg from "fast-glob"
import { cpSync, existsSync, mkdirSync } from "fs"
import minimist from "minimist"
import { resolve } from "path"
import livereload from "rollup-plugin-livereload"
import AutoImport from "unplugin-auto-import/vite"
import Icons from "unplugin-icons/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig, loadEnv } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const distDir = "dist-v2"

const getDefineEnv = () => {
  const mode = process.env.NODE_ENV ?? "development"
  const env = loadEnv(mode, process.cwd())

  return {
    "process.env": {
      DEV_MODE: "true",
      APP_BASE: "/",
      NODE_ENV: mode,
      VITE_DEFAULT_TYPE: "siyuan",
      ...env,
    },
  }
}

const staticCopyTargets = [
  { src: "plugin.json", dest: "plugin.json" },
  { src: "README.md", dest: "README.md" },
  { src: "README_zh_CN.md", dest: "README_zh_CN.md" },
  { src: "LICENSE", dest: "LICENSE" },
  { src: "icon.png", dest: "icon.png" },
  { src: "preview.png", dest: "preview.png" },
  { src: "siyuan/i18n/en_US.json", dest: "i18n/en_US.json" },
  { src: "siyuan/i18n/zh_CN.json", dest: "i18n/zh_CN.json" },
]

const copyStaticAssets = () => ({
  name: "copy-v2-plugin-assets",
  closeBundle() {
    for (const target of staticCopyTargets) {
      const src = resolve(__dirname, target.src)
      const dest = resolve(__dirname, distDir, target.dest)
      const destDir = resolve(dest, "..")
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true })
      }
      cpSync(src, dest)
    }
  },
})

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    nodePolyfills({
      exclude: [],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    copyStaticAssets(),
  ],
  define: getDefineEnv(),
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: distDir,
    emptyOutDir: true,
    sourcemap: false,
    minify: !isWatch,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, "siyuan/index.ts"),
      fileName: "index",
      formats: ["cjs"],
    },
    rollupOptions: {
      plugins: [
        ...(isWatch
          ? [
              livereload(distDir),
              {
                name: "watch-v2-static-assets",
                async buildStart() {
                  const files = await fg([
                    "plugin.json",
                    "README*.md",
                    "LICENSE",
                    "icon.png",
                    "preview.png",
                    "siyuan/i18n/*.json",
                  ])
                  for (const file of files) {
                    this.addWatchFile(file)
                  }
                },
              },
            ]
          : []),
      ],
      external: ["siyuan"],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "index.css"
          }
          return "assets/[name].[ext]"
        },
      },
    },
  },
})
