/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
