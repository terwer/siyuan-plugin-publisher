/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import AutoImport from "unplugin-auto-import/vite"
import Icons from "unplugin-icons/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

/**
 * UI 源码快照（styl / vue 原文），以 `__SYP_UI_SOURCES__` 注入测试环境。
 *
 * 用例里读不到这些文件：本配置给 `node:fs` 打了浏览器桩，且 `.styl` 走 CSS 管线后
 * `?raw` / `?inline` 都拿到空串。这里在 Node 侧（配置文件本身）读取一次即可，
 * 主题一致性守卫（src/ui/assets/themeParity.spec.ts）依赖它扫描颜色声明。
 */
function collectUiSources(): Record<string, string> {
  const root = resolve(__dirname, "src/ui")
  const sources: Record<string, string> = {}
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (entry.endsWith(".styl") || entry.endsWith(".vue")) {
        sources[relative(root, full).split("\\").join("/")] = readFileSync(full, "utf-8")
      }
    }
  }
  walk(root)
  return sources
}

export default defineConfig({
  define: {
    __SYP_UI_SOURCES__: JSON.stringify(collectUiSources()),
  },
  plugins: [
    vue(),
    Icons({
      autoInstall: true,
    }),
    AutoImport({
      dts: false,
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ["src/ui/components/bridge"],
      dts: false,
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
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setup.ts"],
    // 部分用例会挂载完整的设置组件（Element Plus 全量渲染），单跑约 2-3s，
    // 但在全量并行下会超过默认的 5s 上限而误报超时（断言本身并未失败）。
    // 这里放宽到 20s：用例一旦真的失败仍会以断言错误暴露，不受影响。
    testTimeout: 20000,
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "common/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    server: {
      deps: {
        inline: ["element-plus"],
      },
    },
  },
})
