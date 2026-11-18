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
 * 富文本标题（`protyle-title__rich`）本身也带 `protyle` 类，且位于隐藏标签页中的标题片段
 * 不会被 `fn__none` 过滤；只按文档顺序取第一个 `protyle` 会命中标题片段，导致读不到正文
 * 编辑器而显示「未检测到当前文档」。这里只认真正的文档编辑器（issue #2087）。
 */
export const getPageIdFromDocument = (doc: Document): string => {
  const protyleElement = doc.querySelector("div.protyle:not(.fn__none):not(.protyle-lite-fragment)")
  const protyleTitleElement = protyleElement?.querySelector("div.protyle-title")
  return protyleTitleElement?.getAttribute("data-node-id") ?? ""
}
