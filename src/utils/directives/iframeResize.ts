/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Directive, DirectiveBinding, nextTick } from "vue"
import iframeResize from "iframe-resizer/js/iframeResizer"
import { isDev } from "~/src/utils/constants.ts"
import * as _ from "lodash-es"
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
      direction: binding.value.direction || "vertical",
      // autoResize: binding.value.autoResize || false,
      warningTimeout: binding.value.warningTimeout || 30000,
      license: "GPLv3",
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
