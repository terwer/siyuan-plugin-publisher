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

import _ from "lodash-es"
import { StrUtil } from "zhi-common"
import cookie from "cookie-parse"
import { createAppLogger } from "~/src/utils/appLogger.ts"

/**
 * Cookie 工具类
 */
class CookieUtils {
  private static logger = createAppLogger("cookie-utils")

  /**
   * 添加 cookie 数组
   *
   * @param originCookieArray
   * @param newCookieArray
   */
  public static addCookieArray(originCookieArray: string[], newCookieArray: string[]) {
    newCookieArray.forEach((newItem) => {
      const [key] = newItem.split("=")
      const newCookieObj = this.parseCookie(newItem)

      // 检查是否存在相同 key 的 cookie，并比较有效期
      const existingIndex = originCookieArray.findIndex((item) => item.startsWith(`${key}=`))
      if (existingIndex !== -1) {
        const existingCookie = this.parseCookie(originCookieArray[existingIndex])
        // 若新 cookie 的有效期大于旧的，则更新
        if (
          !StrUtil.isEmptyString(newCookieObj.expires) &&
          !StrUtil.isEmptyString(existingCookie.expires) &&
          new Date(newCookieObj.expires).getTime() > new Date(existingCookie.expires).getTime()
        ) {
          originCookieArray[existingIndex] = newItem
        }
      } else {
        originCookieArray.push(newItem)
      }
    })

    return _.uniq(originCookieArray)
  }

  /**
   * 根据 cookie 的 key，获取 cookie
   *
   * @param cookieArray - cookie 数组
   * @param key - cookie 的 key
   */
  public static getCookie(cookieArray: string[], key: string) {
    return cookieArray.find((item) => item.startsWith(`${key}=`))
  }

  /**
   * 根据 cookie 的 key，获取 cookie 对象
   *
   * @param cookieArray - cookie 数组
   * @param key - cookie 的 key
   */
  public static getCookieObject(cookieArray: string[], key: string) {
    const ck = this.getCookie(cookieArray, key)
    return this.parseCookie(ck)
  }

  // ================
  // private methods
  // ================
  private static parseCookie(value: string): any {
    let cookies = {}
    try {
      cookies = cookie.parse(value)
      this.logger.debug("cookieObj", cookies)
    } catch (e) {
      this.logger.warn("Failed to parse cookie =>" + e)
    }

    return cookies
  }
}

export default CookieUtils
