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

/**
 * Adds a copy button to highlightjs code blocks
 */
export class CopyButtonPlugin {
  /**
   * Create a new CopyButtonPlugin class instance
   * @param {Object} [options] - Functions that will be called when a copy event fires
   * @param {CopyCallback} [options.callback]
   * @param {Hook} [options.hook]
   */
  constructor(options = {}) {
    self.hook = options.hook
    self.callback = options.callback
  }

  "after:highlightElement"({ el, text }) {
    // Create the copy button and append it to the codeblock.
    const button = Object.assign(document.createElement("button"), {
      innerHTML: "Copy",
      className: "hljs-copy-button",
    })
    button.dataset.copied = false
    el.parentElement.classList.add("hljs-copy-wrapper")
    el.parentElement.appendChild(button)

    // Add a custom property to the code block so that the copy button can reference and match its background-color value.
    el.parentElement.style.setProperty(
      "--hljs-theme-background",
      window.getComputedStyle(el).backgroundColor
    )

    button.onclick = function () {
      if (!navigator.clipboard) return

      let newText = text
      if (hook && typeof hook === "function") {
        newText = hook(text, el) || text
      }

      navigator.clipboard
        .writeText(newText)
        .then(function () {
          button.innerHTML = "复制成功"
          button.dataset.copied = true

          let alert = Object.assign(document.createElement("div"), {
            role: "status",
            className: "hljs-copy-alert",
            innerHTML: "复制到剪贴板",
          })
          el.parentElement.appendChild(alert)

          setTimeout(() => {
            button.innerHTML = "Copy"
            button.dataset.copied = false
            el.parentElement.removeChild(alert)
            alert = null
          }, 2000)
        })
        .then(function () {
          if (typeof callback === "function") return callback(newText, el)
        })
    }
  }
}

/**
 * @typedef {function} CopyCallback
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {undefined}
 */
/**
 * @typedef {function} Hook
 * @param {string} text - The raw text copied to the clipboard.
 * @param {HTMLElement} el - The code block element that was copied from.
 * @returns {string|undefined}
 */
