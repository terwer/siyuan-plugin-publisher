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
 * 用于处理Typecho相关操作的实用工具类
 */
class TypechoUtils {
  private static logger = createAppLogger("typecho-utils")

  /**
   * 解析给定的主页地址并生成相应的apiUrl地址
   *
   * @param home - 主页地址
   */
  public static parseHomeAndUrl(home: string): { home: string; apiUrl: string } {
    this.logger.debug(`Parsing Home address: ${home}`)
    // 解析主页地址
    let apiUrl = ""
    if (home.endsWith("/index.php/action/xmlrpc")) {
      apiUrl = home
      home = home.replace("/index.php/action/xmlrpc", "")
    } else {
      home = home.replace(/\/$/, "")
      apiUrl = `${home}/index.php/action/xmlrpc`
    }

    this.logger.debug(`Parse result: home=${home}, apiUrl=${apiUrl}`)
    return { home, apiUrl }
  }
}

export default TypechoUtils
