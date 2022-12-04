/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

/* eslint-disable no-undef */
import Hljs from "highlight.js"
import { CopyButtonPlugin } from "../codecopy"
import "../codecopy/codecopy.css"
import "./vs.css"
// const plantumlEncoder = require('plantuml-encoder')
import * as plantumlEncoder from "plantuml-encoder"
import { unescapeHTML } from "../../../strUtil.ts"
import { isInChromeExtension } from "../../../browser/ChromeUtil.ts"

const vueHljs = {}

vueHljs.install = (Vue) => {
  // 代码复制
  Hljs.addPlugin(
    // @ts-ignore
    new CopyButtonPlugin({
      // callback: (text:any, el:any) => console.log("Copied to clipboard", text),
    })
  )

  Vue.directive("highlight", (el) => {
    const blocks = el.querySelectorAll("pre code")
    Array.prototype.forEach.call(blocks, Hljs.highlightBlock)

    // 代码选项卡
    // 代码块
    const codeGroups = el.querySelectorAll("code-group")
    // 处理每个代码块
    codeGroups.forEach((group) => {
      // 防止重复添加
      if (group.getElementsByTagName("ul").length === 0) {
        const newNode = document.createElement("ul")
        newNode.setAttribute("class", "code-tab")

        const codeBlocks = group.querySelectorAll("code-block")
        codeBlocks.forEach((block) => {
          const title = block.attributes.getNamedItem("title")?.value
          const active = block.attributes.getNamedItem("active")?.value
          const isActive = active !== undefined
          // console.log(block.attributes.length)
          // console.log(title)
          // console.log(isActive)

          const item = document.createElement("li")
          item.setAttribute(
            "class",
            isActive ? "code-tab-item current" : "code-tab-item"
          )
          item.innerHTML = title || ""
          item.addEventListener("click", function (event) {
            const targetElement = event.target
            // 选择状态
            // console.log(codeBlocks[0].innerHTML)
            const allLis = targetElement.parentElement.querySelectorAll("li")
            allLis.forEach((li) => {
              li.setAttribute("class", "code-tab-item")
            })
            targetElement.setAttribute("class", "code-tab-item current")

            // 设置tab
            codeBlocks.forEach((cb) => {
              if (
                cb.attributes.getNamedItem("title")?.value ===
                targetElement.innerHTML
              ) {
                cb.setAttribute("active", "")
              } else {
                cb.removeAttribute("active")
              }
            })
            // console.log(targetElement.innerHTML);
          })

          newNode.append(item)
        })

        const firstBlock = codeBlocks[0]
        firstBlock?.parentNode?.insertBefore(newNode, firstBlock)
        // console.log("tab")
      }
    })

    // plantuml
    const umlBlocks = el.querySelectorAll("div.language-plantuml")
    umlBlocks.forEach((item) => {
      const umlstr = unescapeHTML(item.innerHTML)
      const encoded = plantumlEncoder.encode(umlstr)
      // const encoded = "SrJGjLDmibBmICt9oGS0"
      const plantUMLServer =
        process.env.PLANT_UML_SERVR || "https://www.plantuml.com/plantuml/svg/"
      const url = plantUMLServer + encoded

      const newNode = document.createElement("img")
      newNode.setAttribute("src", url)
      item?.parentNode?.insertBefore(newNode, item)
      item.remove()
    })

    // inline mathjax
    const inlineMathBlocks = el.querySelectorAll("span.language-math")
    inlineMathBlocks.forEach((item) => {
      if (isInChromeExtension()) {
        let html = item.innerHTML
        html = html.replace(/，/g, ",")
        html = html.replace(/。/g, ".")
        html = html.replace(/并且/g, "AND")
        html = html.replace(/或者/g, "OR")
        html = encodeURIComponent(html)
        const newHtml =
          '<img src="' + "https://latex.codecogs.com/svg.image?" + html + '" />'
        item.innerHTML = newHtml
      } else {
        const newHtml = "$" + item.innerHTML + "$"
        item.innerHTML = newHtml
      }
    })
    // console.log("inlineMathBlocks count=>", inlineMathBlocks.length)

    // block mathjax
    const mathBlocks = el.querySelectorAll("div.language-math")
    // console.log("mathBlocks count=>", mathBlocks.length)
    mathBlocks.forEach((item) => {
      if (isInChromeExtension()) {
        let html = item.innerHTML
        html = html.replace(/，/g, ",")
        html = html.replace(/。/g, ".")
        html = html.replace(/并且/g, "AND")
        html = html.replace(/或者/g, "OR")
        html = encodeURIComponent(html)
        const newHtml =
          '<img src="' + "https://latex.codecogs.com/svg.image?" + html + '" />'
        item.innerHTML = newHtml
      } else {
        const newHtml = "$$" + item.innerHTML + "$$"
        item.innerHTML = newHtml
      }
    })

    // 渲染
    if (!isInChromeExtension()) {
      MathJax.typeset()
    }
  })
}

export default vueHljs
