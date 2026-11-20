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
 * 不能按 DOM 顺序取第一个 `protyle`：富文本标题片段也带 `protyle` 类，隐藏页签里的标题
 * 片段不会被自身的 `fn__none` 过滤；分屏时另一个（同样可见的）编辑器也可能排在前面。
 * 这里优先按活动窗口的焦点页签定位真正的编辑器，再回退到「第一个未隐藏的文档标题节点」，
 * 后者不依赖 `protyle-lite-fragment` 类名，兼容旧版宿主（issue #2087）。
 */
export const getPageIdFromDocument = (doc: Document): string => {
  const getTitlePageId = (title: Element | null | undefined): string => title?.getAttribute("data-node-id") ?? ""

  // 活动窗口的焦点页签才是当前文档；分屏里另一个编辑器即使可见也不能当作当前文档
  const activeTabId = doc
    .querySelector(".layout__wnd--active .layout-tab-bar .item--focus[data-id]")
    ?.getAttribute("data-id")
  if (activeTabId) {
    const activeEditor = Array.from(doc.querySelectorAll("div.protyle[data-id]")).find(
      (editor) => editor.getAttribute("data-id") === activeTabId
    )
    const activeTitle = activeEditor?.querySelector("div.protyle-title[data-node-id]")
    if (activeTitle) {
      return getTitlePageId(activeTitle)
    }
  }

  // 回退：直接找文档标题节点，跳过隐藏页签（标题带 fn__none 祖先）里的标题
  const titles = Array.from(doc.querySelectorAll("div.protyle-title[data-node-id]"))
  return getTitlePageId(titles.find((title) => title.closest(".fn__none") === null))
}
