/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as cheerio from "cheerio"
import { HtmlMathUtils } from "~/src/utils/htmlMathUtils.ts"

/**
 * 知乎工具类
 *
 * @author terwer
 * @since 1.6.0
 */
class ZhihuUtils {
  /**
   * 处理HTML中的表格，将表格头部移动到表格体部分
   *
   * @param html - 包含表格的HTML字符串
   * @returns 处理后的HTML字符串
   */
  public static processZHTable(html: string): string {
    // 使用Cheerio加载HTML
    const $ = cheerio.load(html)

    // 获取thead内容
    const theadContent = $("table thead").html()
    // 移除thead
    $("table thead").remove()
    // 将thead内容添加到tbody的第一个位置
    $("table tbody tr:first-child").before(theadContent)

    // 选择表格元素并修改属性
    const table = $("table")
    table
      .attr("data-draft-node", "block")
      .attr("data-draft-type", "table")
      .attr("data-size", "normal")
      .attr("data-row-style", "normal")

    return $.html()
  }

  public static processZHMath(html: string): string {
    return HtmlMathUtils.replaceMath(html, (expression) => {
      const src = `//www.zhihu.com/equation?tex=${encodeURIComponent(expression)}`
      const alt = expression
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
      return `<img eeimg="1" src="${src}" alt="${alt}" />`
    })
  }
}

export default ZhihuUtils
