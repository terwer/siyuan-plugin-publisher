/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 从宿主 DOM 读取当前文档的节点 ID。
 *
 * 「当前文档」由活动窗口里聚焦的页签决定：页签头部的 `data-id` 与正文编辑器的 `data-id`
 * 一一对应。只按文档顺序取第一个 `protyle` 会受多分屏、隐藏页签和富文本标题片段影响，
 * 可能读到另一个分屏的文档，甚至读不到 ID（issue #2087）。
 */
export const getPageIdFromDocument = (doc: Document): string => {
  const readNodeId = (element?: Element | null) => element?.getAttribute("data-node-id") ?? ""

  // 1. 优先定位活动窗口中聚焦的页签，再找它对应的正文编辑器。
  const activeTab = doc.querySelector(".layout__wnd--active .layout-tab-bar .item--focus[data-id]")
  const activeTabId = activeTab?.getAttribute("data-id")
  if (activeTabId) {
    const activeTitle = Array.from(doc.querySelectorAll("div.protyle[data-id]"))
      .find((protyle) => protyle.getAttribute("data-id") === activeTabId)
      ?.querySelector("div.protyle-title[data-node-id]")
    const activeDocId = readNodeId(activeTitle)
    if (activeDocId) {
      return activeDocId
    }

    // 正文编辑器尚未挂载时，页签标题同样带有文档 ID
    const headerDocId =
      activeTab?.querySelector(".item__text[data-document-title-id]")?.getAttribute("data-document-title-id") ?? ""
    if (headerDocId) {
      return headerDocId
    }
  }

  // 2. 回退：没有活动页签标记（移动端 / 旧版宿主）时，取第一个不在隐藏容器中的正文标题。
  //    富文本标题片段只有 protyle 类、没有 .protyle-title，因此不会被这里命中。
  const fallbackTitle = Array.from(doc.querySelectorAll("div.protyle-title[data-node-id]")).find(
    (title) => title.closest(".fn__none") === null
  )
  return readNodeId(fallbackTitle)
}
