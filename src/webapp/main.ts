/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 通用壳入口：浏览器扩展 / 思源挂件 / 网页版（nginx、vercel）共用一份。
 *
 * 与思源插件本体（`siyuan/index.ts` + `siyuan/host/pluginHost.ts`）的区别只有一个：
 * 后者要把 Vue 挂进思源的 popup DOM，因此依赖 `siyuan` 包的 `Menu`；本壳没有宿主可挂，
 * 所以直接用 `createApp`（它不 import `siyuan`），宿主差异全部由 `hostAdapter` 判定。
 */
import { createApp as createVueApp } from "vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"
import { createApp } from "~/siyuan/host/createApp.ts"
import ConnectionPanel from "./ConnectionPanel.vue"
import {
  describeHost,
  detectWebShellHost,
  needsConnectionPanel,
  resolveHostDocId,
  resolveInitialView,
} from "./hostAdapter.ts"

const requireElement = (id: string): HTMLElement => {
  const el = document.getElementById(id)
  if (!el) {
    throw new Error(`壳挂载点缺失：#${id}`)
  }
  return el
}

const host = detectWebShellHost()
const docId = resolveHostDocId(host)
const withConnectionPanel = needsConnectionPanel(host)

// 扩展弹窗按固定宽度开窗，网页版/挂件铺满容器（见 index.html 的 body 类）
document.body.classList.add(host === "extension" ? "is-popup" : "is-page")

const Pane = requireElement("syp-web")
const connectionPane = requireElement("syp-web-connection")
const toggleButton = requireElement("syp-web-toggle") as HTMLButtonElement
const titleEl = document.querySelector<HTMLElement>(".syp-web-shell__title")

// 1、主界面
const App = createApp({
  locale: "plugin",
  messages: {
    plugin: zhCN,
  },
  initialView: resolveInitialView(docId),
  docId,
  onClose: () => {
    window.close()
  },
})
App.mount(Pane)

// 2、思源连接配置：仅扩展与网页版需要（挂件与思源同源，内核地址由 origin 推得）
let connectionApp: ReturnType<typeof createVueApp> | null = null
let showingConnection = false

const applyPaneVisibility = () => {
  connectionPane.hidden = !showingConnection
  Pane.hidden = showingConnection
  toggleButton.textContent = showingConnection ? "返回发布界面" : "连接配置"
}

if (withConnectionPanel) {
  connectionApp = createVueApp(ConnectionPanel)
  connectionApp.mount(connectionPane)
  toggleButton.addEventListener("click", () => {
    showingConnection = !showingConnection
    applyPaneVisibility()
  })
  applyPaneVisibility()
} else {
  // 挂件不需要连接配置：去掉入口与面板，只留主界面
  toggleButton.remove()
  connectionPane.remove()
}

if (titleEl) {
  titleEl.textContent = `思源笔记发布工具 · ${describeHost(host)}`
}

// 观测点：便于在 DevTools / 自动化里确认挂载结果与宿主判定
;(window as unknown as Record<string, unknown>).__SYP_WEB_SHELL__ = {
  host,
  docId,
  initialView: resolveInitialView(docId),
  withConnectionPanel,
  App,
  connectionApp,
}
