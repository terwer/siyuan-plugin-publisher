/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

// 警告⚠️：请勿在非思源笔记浏览器环境调用此文件中的任何方法

const initSlot = () => {
  console.warn("在所有文档前面加上一个挂件插槽")

  function showPreviousWidgetsSlot() {
    setInterval(DocumentShowPreviousWidget, 300)
  }

  DocumentShowPreviousWidget()
  showPreviousWidgetsSlot()

  function DocumentShowPreviousWidget() {
    var syWin = window
    var openDoc = syWin.document.querySelectorAll(
      ".layout-tab-container>.fn__flex-1.protyle:not(.fn__none)"
    )
    // 挂件需要用parent
    if (openDoc.length === 0) {
      syWin = parent.window
      openDoc = syWin.document.querySelectorAll(
        ".layout-tab-container>.fn__flex-1.protyle:not(.fn__none)"
      )
    }
    // console.log("openDoc=>", openDoc)

    // ===============================
    // 上面判断完成后使用syWin代替Window
    // ===============================

    var allDocumentTitleElement = []
    for (let index = 0; index < openDoc.length; index++) {
      const element = openDoc[index]
      element.setAttribute("withPreviousWidgets", true)
      allDocumentTitleElement.push(element.children[1].children[1].children[1])
    }

    for (let index = 0; index < allDocumentTitleElement.length; index++) {
      const element = allDocumentTitleElement[index]

      if (
        !element.parentElement.querySelector(".previous-widgets-slot") &&
        element.parentElement.parentElement.querySelector("[data-node-id]")
      ) {
        var documentPreviousWidgetsSlotElement = CreatePreviousWidgetsSlot(
          element.parentElement
        )
        element.parentElement.appendChild(documentPreviousWidgetsSlotElement)
      }
    }

    function CreatePreviousWidgetsSlot(element) {
      let cloneNode = element.parentElement
        .querySelector(".protyle-wysiwyg")
        .cloneNode(false)
      cloneNode.innerHTML = `
  <div class="iframe-content">
      <iframe src="/widgets/sy-post-publisher/?isSlot=true" scrolling="no"></iframe>
  </div>
  `
      let id = element.parentElement.parentElement
        .querySelector("[data-node-id]")
        .getAttribute("data-node-id")
      cloneNode.setAttribute("data-node-id", id)
      cloneNode.setAttribute("contenteditable", false)
      cloneNode.setAttribute("style", "padding: 0;")
      let div = document.createElement("div")
      div.setAttribute("class", "previous-widgets-slot")
      div.setAttribute("contenteditable", false)
      div.setAttribute("style", "padding: 0;")
      let root = div.attachShadow({ mode: "open" })
      root.innerHTML = `
      <style>
          iframe{
              width:100%;
              min-height:53px;
              height:53px;
              border:none;
              margin:0;
              padding:0;
              overflow: hidden;
          }
      </style>
      `
      root.appendChild(cloneNode)
      return div
    }
  }
}

module.exports = initSlot
