/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as _ from "lodash-es"
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
   * @param isForce
   */
  public static addCookieArray(originCookieArray: string[], newCookieArray: string[], isForce: boolean = false) {
    let isUpdated = false
    newCookieArray.forEach((newItem) => {
      const [key] = newItem.split("=")
      const newCookieObj = this.parseCookie(newItem)

      // 检查是否存在相同 key 的 cookie，并比较有效期
      const existingIndex = originCookieArray.findIndex((item) => item.startsWith(`${key}=`))
      if (existingIndex !== -1) {
        const existingCookie = this.parseCookie(originCookieArray[existingIndex])
        // 若新 cookie 的有效期大于旧的，则更新
        if (
          (!StrUtil.isEmptyString(newCookieObj.expires) &&
            !StrUtil.isEmptyString(existingCookie.expires) &&
            new Date(newCookieObj.expires).getTime() > new Date(existingCookie.expires).getTime()) ||
          isForce
        ) {
          originCookieArray[existingIndex] = newItem
          isUpdated = true
        }
      } else {
        originCookieArray.push(newItem)
        isUpdated = true
      }
    })

    return {
      isUpdated,
      cookieArray: _.uniq(originCookieArray),
    }
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
   * 从字符串中获取 cookie
   *
   * @param cookieName - cookie 的名称
   * @param cookieString - cookie 字符串
   */
  public static getCookieFromString(cookieName: string, cookieString?: string): string {
    if (typeof window === "undefined" && !cookieString) {
      return ""
    }
    const cookies = (cookieString || document.cookie).split(";")
    const cookiePattern = new RegExp(`^${cookieName}=`)
    for (const cookie of cookies) {
      const trimmedCookie = cookie.trim()
      if (cookiePattern.test(trimmedCookie)) {
        return trimmedCookie.split("=")[1]
      }
    }
    return ""
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
