/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it } from "vitest"
import { getPageIdFromDocument } from "~/src/utils/pageIdFromDocument.ts"

afterEach(() => {
  document.body.innerHTML = ""
})

describe("getPageIdFromDocument", () => {
  it("返回活动文档的节点 ID", () => {
    document.body.innerHTML = `
      <div class="fn__flex-1 protyle" data-protyle-lite="false">
        <div class="protyle-title" data-node-id="20260526165741-p675vq6">
          <div class="protyle-title__rich protyle-lite-fragment protyle">图片最新测试</div>
        </div>
      </div>`

    expect(getPageIdFromDocument(document)).toBe("20260526165741-p675vq6")
  })

  it("多分屏时取活动分屏聚焦页签对应的文档", () => {
    document.body.innerHTML = `
      <div class="layout__wnd">
        <ul class="layout-tab-bar">
          <li class="item item--focus" data-id="tab-left">
            <span class="item__text" data-document-title-id="doc-left">左侧文档</span>
          </li>
        </ul>
        <div class="fn__flex-1 protyle" data-id="tab-left">
          <div class="protyle-title" data-node-id="doc-left">左侧文档</div>
        </div>
      </div>
      <div class="layout__wnd layout__wnd--active">
        <ul class="layout-tab-bar">
          <li class="item item--focus" data-id="tab-right">
            <span class="item__text" data-document-title-id="doc-right">右侧文档</span>
          </li>
        </ul>
        <div class="fn__flex-1 protyle" data-id="tab-right">
          <div class="protyle-title" data-node-id="doc-right">右侧文档</div>
        </div>
      </div>`

    // 按文档顺序取第一个可见编辑器会误取左侧分屏，当前文档应是活动分屏的右侧文档
    expect(getPageIdFromDocument(document)).toBe("doc-right")
  })

  it("活动文档的正文编辑器尚未挂载时读取页签标题上的文档 ID", () => {
    document.body.innerHTML = `
      <div class="layout__wnd layout__wnd--active">
        <ul class="layout-tab-bar">
          <li class="item item--focus" data-id="tab-active">
            <span class="item__text" data-document-title-id="doc-active">活动文档</span>
          </li>
        </ul>
      </div>
      <div class="fn__flex-1 protyle" data-id="tab-other">
        <div class="protyle-title" data-node-id="doc-other">其他文档</div>
      </div>`

    expect(getPageIdFromDocument(document)).toBe("doc-active")
  })

  it("跳过隐藏标签页里的标题，返回可见文档", () => {
    document.body.innerHTML = `
      <div class="fn__flex-1 protyle fn__none">
        <div class="protyle-title" data-node-id="20260526165741-hidden">
          <div class="protyle-title__rich protyle-lite-fragment protyle">隐藏的标签页</div>
        </div>
      </div>
      <div class="fn__flex-1 protyle">
        <div class="protyle-title" data-node-id="20260526165741-active">
          <div class="protyle-title__rich protyle-lite-fragment protyle">当前文档</div>
        </div>
      </div>`

    expect(getPageIdFromDocument(document)).toBe("20260526165741-active")
  })

  it("没有正文编辑器时返回空字符串", () => {
    document.body.innerHTML = `
      <div class="protyle-title__rich protyle-lite-fragment protyle">只有标题片段</div>`

    expect(getPageIdFromDocument(document)).toBe("")
  })

  it("没有 protyle 时返回空字符串", () => {
    document.body.innerHTML = `<div class="layout"></div>`

    expect(getPageIdFromDocument(document)).toBe("")
  })
})
