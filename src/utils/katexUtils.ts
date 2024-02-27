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

import katex from "katex"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * 公式渲染
 *
 * @author terwer
 * @since 1.18.6
 */
class KatexUtils {
  private static logger = createAppLogger("katex-utils")

  /**
   * 获得要渲染 KaTeX 表达式的 HTML
   *
   * @param mathExpression katex
   */
  public static renderToString(mathExpression: string) {
    this.logger.debug("准备处理 Katex =>", { mathExpression: mathExpression })
    return katex.renderToString(mathExpression)
  }
}

export default KatexUtils
