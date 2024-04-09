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

/**
 * Md 处理工具类
 *
 * @author terwer
 * @since 1.21.0
 * @version 1.21.0
 */
class MdUtils {
  /**
   * 替换标记
   *
   * @param text 文本
   * @param sign 标记符号，例如：-、*
   * @param className 类名
   * @param style css 样式
   */
  public static replaceSign(text: string, sign: string, className = "", style = "") {
    const regex = new RegExp("``[^`]*``|" + sign + "[^" + sign + "]*?" + sign + "|`[^`]*`", "g")
    let inCodeBlock = false
    let result = ""
    let lastIndex = 0

    text.replace(regex, ((match: any, index: any) => {
      if (match.startsWith("``")) {
        inCodeBlock = !inCodeBlock
      } else if (!inCodeBlock && (match.startsWith(sign) || match.startsWith("`"))) {
        result +=
          text.slice(lastIndex, index) + `<span class="${className}" style="${style}">${match.slice(2, -2)}</span>`
        lastIndex = index + match.length
      }
    }) as any)

    result += text.slice(lastIndex)
    return result
  }
}

export { MdUtils }
