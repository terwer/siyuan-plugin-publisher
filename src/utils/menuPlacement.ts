/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 面板打开方式。
 *
 * 桌面端绝不能走 `fullscreen`：思源会把菜单切换成移动端全屏布局，
 * 显示「返回上一层」标题条并让空的菜单内容容器占满剩余高度，
 * 插件内容因此被顶到容器下方（issue #2054）。
 */
export type MenuPlacement =
  | { mode: "fullscreen" }
  | { mode: "popover"; x: number; y: number; isLeft: boolean }

/**
 * 计算面板打开方式。
 *
 * - 移动端：全屏菜单
 * - 桌面端且锚点有效：贴着锚点弹出
 * - 桌面端且没有有效锚点（例如顶栏按钮不可用）：在窗口中部弹出，而不是退回全屏菜单
 *
 * @param isMobile 是否移动端
 * @param anchorRect 锚点元素的位置尺寸
 * @param viewportWidth 当前窗口宽度
 */
export const resolveMenuPlacement = (
  isMobile: boolean,
  anchorRect: { left: number; top: number; bottom: number; width: number; height: number } | undefined,
  viewportWidth: number
): MenuPlacement => {
  if (isMobile) {
    return { mode: "fullscreen" }
  }
  const hasAnchor = !!anchorRect && (anchorRect.width > 0 || anchorRect.height > 0)
  if (anchorRect && hasAnchor) {
    return { mode: "popover", x: Math.round(anchorRect.left), y: Math.round(anchorRect.bottom), isLeft: true }
  }
  return { mode: "popover", x: Math.max(8, Math.round(viewportWidth / 2)), y: 72, isLeft: true }
}
