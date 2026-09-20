/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 浏览器扩展弹窗壳（POC）。
 *
 * - V2 主界面：`createV2VueApp`（`siyuan/v2/createV2App.ts`）——不依赖 `siyuan` 包，
 *   宿主依赖（docId / onClose / i18n）全部走可选注入，因此能直接在扩展弹窗里挂载。
 * - 连接配置：`ExtConnectionPanel.vue`，读写 `useSiyuanSettingStore`，用于补上
 *   「思源内核地址 + Token」——V2 目前没有 `/setting/siyuan` 的对应分区。
 *
 * 这里刻意不使用 `siyuan/v2/v2Host.ts`：它 `import { Menu } from "siyuan"`，扩展里不可用。
 */
import { createApp } from "vue"
import zhCN from "~/siyuan/i18n/zh_CN.json"
import { createV2VueApp } from "~/siyuan/v2/createV2App.ts"
import ExtConnectionPanel from "./ExtConnectionPanel.vue"

const requireElement = (id: string): HTMLElement => {
  const el = document.getElementById(id)
  if (!el) {
    throw new Error(`扩展壳挂载点缺失：#${id}`)
  }
  return el
}

const connectionPane = requireElement("syp-ext-connection")
const v2Pane = requireElement("syp-ext-v2")
const toggleButton = requireElement("syp-ext-toggle")

// 1、V2 主界面
//    扩展弹窗没有宿主 DOM，取不到活动文档 id，先传空串让 V2 走「未检测到文档」的既有分支。
const v2App = createV2VueApp({
  locale: "plugin",
  messages: {
    plugin: zhCN,
  },
  docId: "",
  onClose: () => {
    window.close()
  },
})
v2App.mount(v2Pane)

// 2、连接配置面板（独立 Vue 应用：不依赖 pinia / vue-i18n，避免与 V2 的 i18n 上下文耦合）
const connectionApp = createApp(ExtConnectionPanel)
connectionApp.mount(connectionPane)

// 3、「连接配置 / V2 主界面」开关
let showingConnection = false

const applyPaneVisibility = () => {
  connectionPane.hidden = !showingConnection
  v2Pane.hidden = showingConnection
  toggleButton.textContent = showingConnection ? "返回发布界面" : "连接配置"
}

toggleButton.addEventListener("click", () => {
  showingConnection = !showingConnection
  applyPaneVisibility()
})

applyPaneVisibility()

// POC 观测点：便于在 DevTools 里确认两个应用挂载成功
;(window as any).__SYP_EXT_POC__ = {
  v2App,
  connectionApp,
}
