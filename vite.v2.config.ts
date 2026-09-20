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
/**
 * 插件 lib 的唯一产出目录。
 *
 * V1 退役后不再有 `vite.v1.siyuan.config.ts` 那条平行的 lib 构建，这里就是发行包目录，
 * 因此与 `scripts/make_dev_link.py` 的默认值（`dist`）保持一致，`pnpm makeLink` 直接可用。
 */
const distDir = "dist"
const v2PluginAppBase = "/plugins/siyuan-plugin-publisher/"

const getDefineEnv = () => {
  const mode = process.env.NODE_ENV ?? "development"
  const env = loadEnv(mode, process.cwd())

  return {
    "process.env": {
      ...env,
      // watch（开发）时开详细日志，正式构建关掉：原先恒为 "true"，发行包会一直跑调试日志
      DEV_MODE: process.env.DEV_MODE ?? (isWatch ? "true" : "false"),
      APP_BASE: v2PluginAppBase,
      NODE_ENV: mode,
      VITE_DEFAULT_TYPE: "siyuan",
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
    rolldownOptions: {
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
