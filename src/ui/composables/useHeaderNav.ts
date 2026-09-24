import type { AppView } from "~/src/ui/components/layout/UnifiedWorkspaceShell.vue"

/**
 * 顶部导航入口：常驻不变。
 *
 * 设计约束（体验红线）：集合与顺序**永不变**，任何点击都不隐藏、不替换入口。
 * 当前所在项用 active 表示，退出能力放在内容区而不是把入口本身变成「返回」。
 */
export const HEADER_NAV_KEYS = ["quick_publish", "single_publish", "batch_publish", "manage", "settings"] as const

export type HeaderNavKey = (typeof HEADER_NAV_KEYS)[number]

export interface HeaderNavEntry {
  /** 目标视图，等同于导航项自身标识 */
  key: HeaderNavKey
  /** 当前是否位于该入口 */
  active: boolean
  /** 是否不可用；不可用时入口仍在原位，只是点不动 */
  disabled: boolean
  /** 不可用原因对应的 i18n key，仅供聚焦/悬浮说明使用 */
  disabledReasonKey: string
}

/**
 * 构造顶部导航项。
 *
 * 只有「详细发布 / 批量分发」在没有当前文档时不可用：这两者都要以当前文档为发布对象，
 * 没有文档就无从发布。它们依然常驻，避免入口忽隐忽现。
 */
export function buildHeaderNavEntries(input: {
  currentView: AppView
  hasDocument: boolean
}): HeaderNavEntry[] {
  const needsDocument: HeaderNavKey[] = ["single_publish", "batch_publish"]
  return HEADER_NAV_KEYS.map((key) => {
    const disabled = !input.hasDocument && needsDocument.includes(key)
    return {
      key,
      active: key === input.currentView,
      disabled,
      disabledReasonKey: disabled ? "app.nav.needDocument" : "",
    }
  })
}

/** 一次点击应当产生的动作 */
export type HeaderNavAction = "navigate" | "reset" | "none"

/**
 * 把一次点击解析成动作，供调用方执行。
 *
 * 规则只有三条，且不改变入口集合：
 * - 不可用 → 什么都不做（入口仍在原位）；
 * - 不在该视图 → 前往该入口；
 * - 已在该入口 → 回到该目的地的根状态（文章管理收起滑入面板、设置回到账号列表）。
 */
export function resolveHeaderNavAction(input: {
  key: HeaderNavKey
  disabled: boolean
  currentView: AppView
}): HeaderNavAction {
  if (input.disabled) {
    return "none"
  }
  if (input.key !== input.currentView) {
    return "navigate"
  }
  if (input.key === "manage" || input.key === "settings") {
    return "reset"
  }
  return "none"
}
