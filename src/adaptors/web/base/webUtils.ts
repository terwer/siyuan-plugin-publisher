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
 * Web工具类，包含用于操作Cookie的方法
 *
 * @since 1.12.0
 */
class WebUtils {
  /**
   * 从Cookie字符串中读取指定键的值
   *
   * @param key - 要查找的Cookie键
   * @param cookieString - 包含Cookie的字符串
   * @returns 包含键对应值的Cookie值，如果未找到则返回空字符串
   */
  public static readCookie(key: string, cookieString: string): string {
    // 将Cookie字符串分割成Cookie键值对数组
    const cookies = cookieString.split(";")

    // 遍历Cookie数组，查找指定键的Cookie
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split("=")

      // 去除Cookie键的空白字符并比较是否与指定键相符
      if (cookieKey.trim() === key) {
        // 返回解码后的Cookie值，如果解码失败则返回空字符串
        return decodeURIComponent(cookieValue) ?? ""
      }
    }

    // 如果未找到指定键的Cookie则返回空字符串
    return ""
  }
}

export default WebUtils
