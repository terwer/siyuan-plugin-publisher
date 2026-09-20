/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 浏览器扩展弹窗（V2）POC 独立构建配置。
 *
 * 以 `vite.v2.config.ts` 为蓝本，差别只在「入口/产物形态」：
 * - 入口是 HTML（`src/extensions/shell/popup.html`）而不是 lib/`siyuan/index.ts`；
 * - `root` 指到壳目录，让产物落在 `extension/poc/popup.html`（相对引用可直接被 Chrome 加载）；
 * - 不 external `siyuan`：壳链路完全不 import 它（`siyuan/v2/v2Host.ts` 才 import）。
 *
 * 用法：pnpm exec vite build --config vite.ext.config.ts
 */
import vue from "@vitejs/plugin-vue"
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import minimist from "minimist"
import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import Icons from "unplugin-icons/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig, loadEnv } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const distDir = "extension/poc"
const shellDir = resolve(__dirname, "src/extensions/shell")

/**
 * 与 `vite.v1.app.config.ts`（extension 构建）保持同口径：
 * - `VITE_DEFAULT_TYPE: "siyuan"` → `isStorageViaSiyuanApi()` 为真，账号/动态配置走思源内核 HTTP 存储；
 * - `APP_BASE: "/"` → 扩展自身根目录（V1 扩展构建同样是站点根形态）；
 * - `DEV_MODE: "true"` → 保留详细日志，便于 POC 观测（正式扩展构建应置 false）。
 */
const getDefineEnv = () => {
  const mode = process.env.NODE_ENV ?? "development"
  const env = loadEnv(mode, process.cwd())

  return {
    "process.env": {
      ...env,
      DEV_MODE: "true",
      APP_BASE: "/",
      NODE_ENV: mode,
      VITE_DEFAULT_TYPE: "siyuan",
      VITE_SIYUAN_API_URL: process.env.VITE_SIYUAN_API_URL ?? env.VITE_SIYUAN_API_URL ?? "http://127.0.0.1:6806",
    },
  }
}

/** 复制 POC manifest（version 取 package.json，避免手写漂移），产物目录即可被 Chrome 直接加载。 */
const copyPocManifest = () => ({
  name: "copy-ext-poc-manifest",
  closeBundle() {
    const source = resolve(shellDir, "manifest.poc.json")
    const target = resolve(__dirname, distDir, "manifest.json")
    const targetDir = resolve(target, "..")
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true })
    }

    const manifest = JSON.parse(readFileSync(source, "utf-8"))
    const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"))
    manifest.version = pkg.version
    writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8")
    cpSync(source, resolve(__dirname, distDir, "manifest.poc.json"))
  },
})

export default defineConfig({
  root: shellDir,
  base: "./",
  publicDir: false,
  cacheDir: resolve(__dirname, "node_modules/.vite-ext-poc"),
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    // V2 与桥接组件里有大量无 import 的 kebab-case 组件（el-* 等），漏配只会在运行时炸
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    // `src/utils/EnvUtil.ts` 用了 node:buffer
    nodePolyfills({
      exclude: [],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    copyPocManifest(),
  ],
  define: getDefineEnv(),
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: resolve(__dirname, distDir),
    emptyOutDir: true,
    sourcemap: false,
    minify: !isWatch,
    cssCodeSplit: false,
    rolldownOptions: {
      input: {
        popup: resolve(shellDir, "popup.html"),
      },
    },
  },
})
