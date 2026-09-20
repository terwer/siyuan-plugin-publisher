/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 通用 V2 壳的宿主适配。
 *
 * 同一个壳要服务四种「没有思源插件宿主」的产物：
 * - `extension`：浏览器扩展弹窗，`chrome-extension://` 身份，没有宿主文档，必须手填内核地址与 Token；
 * - `widget`：思源挂件（iframe 内），父窗口就是思源，内核地址可由 origin 推得、当前文档可由父窗口读得；
 * - `web`：`nginx` / `vercel` 部署的网页版，与扩展同样没有宿主，需要手填内核地址；
 *
 * 这里只做「能力判定」，不碰 V2 本体——V2 的宿主依赖全部是可注入参数
 * （`docId` / `initialView` / i18n / `onClose`，见 `siyuan/v2/createV2App.ts`）。
 */
import { SiyuanDevice } from "zhi-device"
import type { V2InitialView } from "~/siyuan/v2/createV2App.ts"
import { getWidgetId } from "~/src/utils/widgetUtils.ts"

export type WebShellHost = "extension" | "widget" | "web"

/** 判定当前壳跑在哪种产物里 */
export const detectWebShellHost = (): WebShellHost => {
  if (typeof location !== "undefined" && location.protocol === "chrome-extension:") {
    return "extension"
  }

  const inIframe = typeof window !== "undefined" && window.parent !== window
  const hostWindow = SiyuanDevice.siyuanWindow() as { siyuan?: unknown } | undefined
  if (inIframe && hostWindow?.siyuan !== undefined) {
    return "widget"
  }

  return "web"
}

/**
 * 取宿主当前的文档 id。
 *
 * 只有挂件能取到：它嵌在思源文档里，父窗口的 `protyle` 就是当前文档。
 * 扩展与网页版没有宿主文档，返回空串，由 V2 走「未检测到文档」分支。
 */
export const resolveHostDocId = (host: WebShellHost): string => {
  if (host !== "widget") {
    return ""
  }
  try {
    return getWidgetId() ?? ""
  } catch {
    return ""
  }
}

/**
 * 是否需要「思源连接配置」面板。
 *
 * 挂件与思源同源，内核地址由 origin 推得（`useSiyuanSettingStore` 在思源上下文里会同步 origin），
 * 不暴露该面板；扩展与网页版必须让用户自己填内核地址与 Token。
 */
export const needsConnectionPanel = (host: WebShellHost): boolean => host !== "widget"

/**
 * 初始视图。
 *
 * 有宿主文档（挂件）→ 直接进快速发布；没有（扩展/网页版）→ 进文章管理，
 * 让用户从内核的笔记本里挑文档再发布。否则会停在「请先打开一个文档」的死路上。
 */
export const resolveInitialView = (docId: string): V2InitialView => (docId ? "quick_publish" : "manage")

/** 供壳与排障使用 */
export const describeHost = (host: WebShellHost): string => {
  switch (host) {
    case "extension":
      return "浏览器扩展"
    case "widget":
      return "思源挂件"
    default:
      return "网页版"
  }
}
