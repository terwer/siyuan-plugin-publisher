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
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Lute 工具类
 */
class LuteUtil {
  private static logger = createAppLogger("lute-util")

  /**
   * 使用 Lute 渲染 HTML
   *
   * @param md
   */
  public static mdToHtml(md: string) {
    if (typeof window === "undefined") {
      this.logger.warn("不是浏览器环境，不渲染")
      return md
    }

    const Lute = (window as any).Lute
    if (!Lute) {
      this.logger.warn("未找到Lute，不渲染")
      return md
    }

    this.logger.info("found Lute =>", Lute)
    this.logger.info("使用Lute渲染Markdown")
    const lute = Lute.New()
    const html = lute.MarkdownStr("", md)
    this.logger.debug("md to html =>", { html })
    return html
  }
}

export { LuteUtil }
