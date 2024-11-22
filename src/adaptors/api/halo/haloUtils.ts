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

/**
 * Halo 平台工具类
 *
 * @author terwer
 * @version 1.15.0
 * @since 1.15.0
 */
class HaloUtils {
  /**
   * 将正文 h1-h6的标签加上 id，例如 <h1 xxx>标题1</h1> 转换成 <h1 id="标题1">标题1</h1>
   *
   * @param content
   */
  public static addIdToH1_H6(content: string): string {
    return content.replace(/<h([1-6])>(.*?)<\/h\1>/g, function (match, level, title) {
      // 直接使用标题作为 ID
      const id = title
      return `<h${level} id="${id}">${title}</h${level}>`
    })
  }
}

export default HaloUtils
