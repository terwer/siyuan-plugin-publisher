/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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

import { Directive, DirectiveBinding, nextTick } from "vue"
import iframeResize from "iframe-resizer/js/iframeResizer"
import { isDev } from "~/src/utils/constants.ts"
import _ from "lodash-es"
import { ElLoading } from "element-plus"

interface ResizableHTMLElement extends HTMLElement {
  iFrameResizer?: {
    removeListeners: () => void
  }
}

const resize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const loading = ElLoading.service({
      lock: true,
      text: binding.value.loadText,
      // background: "rgba(0, 0, 0, 0.7)",
    })

    const options = {
      log: binding.value.log || isDev,
      checkOrigin: binding.value.checkOrigin || false,
      iframeResizerEnable: binding.value.iframeResizerEnable || true,
      autoResize: binding.value.autoResize || false,
      warningTimeout: binding.value.warningTimeout || 30000,
    }

    el.addEventListener("load", () => {
      nextTick(() => {
        // 获取最大宽度
        const maxWidth = _.max([
          document.body.offsetWidth,
          document.body.scrollWidth,
          document.documentElement.offsetWidth,
          document.documentElement.scrollWidth,
        ])

        // 设置元素高度为最大宽度
        el.style.height = maxWidth + "px"
        iframeResize(options, el)
      })
    })

    el.onload = function () {
      // iframe加载完成后执行的操作
      loading.close()
    }
  },
  unmounted(el: HTMLElement) {
    const resizableEl = el as ResizableHTMLElement

    if (resizableEl.iFrameResizer) {
      resizableEl.iFrameResizer.removeListeners()
    }
  },
}

export default resize
