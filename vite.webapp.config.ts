/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 通用壳的构建配置：浏览器扩展 / 思源挂件 / 网页版（nginx、vercel）共用一份。
 *
 * - 入口是 `src/webapp/index.html`（应用壳），不含 vue-router；
 * - 产物按 `BUILD_TYPE` 落到各自的目录，与 `scripts/*.py` 的约定一致；
 * - 不 external `siyuan`：壳链路完全不 import 它（只有 `siyuan/host/pluginHost.ts` 才 import）。
 *
 * 用法：
 *   BUILD_TYPE=extension EXT_TYPE=chrome pnpm exec vite build --config vite.webapp.config.ts
 *   BUILD_TYPE=widget  pnpm exec vite build --config vite.webapp.config.ts
 *   BUILD_TYPE=nginx   pnpm exec vite build --config vite.webapp.config.ts
 *   BUILD_TYPE=vercel  pnpm exec vite build --config vite.webapp.config.ts
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

type BuildType = "extension" | "widget" | "nginx" | "vercel" | "webapp"

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const buildType = (args.type ?? process.env.BUILD_TYPE ?? "webapp") as BuildType
const extType = args.extType ?? process.env.EXT_TYPE ?? "chrome"

const webappDir = resolve(__dirname, "src/webapp")

/** 各产物目录与 base，保持与既有构建脚本、以及扩展 manifest 的引用形态一致 */
const resolveTarget = (): { outDir: string; base: string } => {
  switch (buildType) {
    case "extension":
      // 扩展页按自身根目录解析资源（manifest 的 popup/资源路径都是相对产物根）
      return { outDir: `extension/${extType}`, base: "./" }
    case "widget":
      // 挂件由思源以 iframe 载入，同样是相对路径
      return { outDir: "widget", base: "./" }
    case "nginx":
      return { outDir: "nginx", base: "/" }
    case "vercel":
      // 注意：不要用 dist —— 那是插件 lib 的产物目录
      return { outDir: "vercel", base: "/" }
    default:
      return { outDir: "webapp", base: "/" }
  }
}

const target = resolveTarget()

/**
 * 与插件本体同口径的 define：
 * - `VITE_DEFAULT_TYPE: "siyuan"` → `isStorageViaSiyuanApi()` 为真，账号/动态配置走思源内核 HTTP 存储
 *   （这正是扩展/网页版能读到用户既有账号资产的前提）；
 * - `APP_BASE: "/"` → 壳自身根目录；
 * - `VITE_SIYUAN_API_URL` → 首次使用时的内核地址默认值（用户随后可在「连接配置」里改）。
 */
const getDefineEnv = () => {
  const mode = process.env.NODE_ENV ?? "development"
  const env = loadEnv(mode, process.cwd())

  return {
    "process.env": {
      ...env,
      DEV_MODE: process.env.DEV_MODE ?? "false",
      APP_BASE: "/",
      NODE_ENV: mode,
      VITE_DEFAULT_TYPE: "siyuan",
      VITE_SIYUAN_API_URL: process.env.VITE_SIYUAN_API_URL ?? env.VITE_SIYUAN_API_URL ?? "http://127.0.0.1:6806",
    },
  }
}

/** 扩展产物：把 manifest 与图标一并落盘（version 取 package.json，避免手写漂移） */
const copyExtensionAssets = () => ({
  name: "copy-extension-assets",
  closeBundle() {
    if (buildType !== "extension") {
      return
    }

    const source = resolve(__dirname, "src/extensions/manifest.json")
    const outDir = resolve(__dirname, target.outDir)
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true })
    }

    const manifest = JSON.parse(readFileSync(source, "utf-8"))
    const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf-8"))
    manifest.version = pkg.version
    writeFileSync(resolve(outDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf-8")

    // manifest 里引用的图标（旧链由 scripts/ext_build.py 整目录拷贝 src/extensions）
    const iconSource = resolve(__dirname, "src/extensions/images")
    if (existsSync(iconSource)) {
      cpSync(iconSource, resolve(outDir, "images"), { recursive: true })
    }
  },
})

export default defineConfig({
  root: webappDir,
  base: target.base,
  publicDir: false,
  cacheDir: resolve(__dirname, `node_modules/.vite-webapp-${buildType}`),
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    // 应用与桥接组件里有大量无 import 的 kebab-case 组件（el-* 等），漏配只会在运行时炸
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: false,
    }),
    Components({
      dirs: ["src/ui/components/bridge"],
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
    copyExtensionAssets(),
  ],
  define: getDefineEnv(),
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
  build: {
    outDir: resolve(__dirname, target.outDir),
    emptyOutDir: true,
    sourcemap: false,
    minify: !isWatch,
    cssCodeSplit: false,
    rolldownOptions: {
      input: {
        index: resolve(webappDir, "index.html"),
      },
    },
  },
})
