/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
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
