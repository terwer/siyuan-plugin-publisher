/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as cheerio from "cheerio"

/**
 * 公式替换回调
 *
 * @param expression 公式内容，已去掉 $ / $$ 分隔符并去除首尾空白
 * @param display 是否为块级公式（$$...$$）
 * @returns 替换后的 HTML；返回 null 表示保留原文
 */
export type HtmlMathReplacer = (expression: string, display: boolean) => string | null

/**
 * 不会被当作公式解析的标签
 */
const SKIP_TAGS = new Set(["pre", "code", "script", "style", "textarea"])

/**
 * 同时匹配块级公式 $$...$$ 和行内公式 $...$
 */
const MATH_PATTERN = /\$\$([^$]+)\$\$|\$([^$]+)\$/g

/**
 * HTML 公式处理工具类
 *
 * 只在普通文本节点里识别公式：代码块、行内代码等原样保留，
 * 也不允许一个公式跨越多段文本或跨越元素边界。
 *
 * @author terwer
 * @since 2.4.1
 */
class HtmlMathUtils {
  /**
   * 处理 HTML 中的公式
   *
   * @param html 原始 HTML
   * @param replacer 公式替换回调
   * @returns 处理后的 HTML
   */
  public static replaceMath(html: string, replacer: HtmlMathReplacer): string {
    if (!html) {
      return html
    }

    const $ = cheerio.load(html, {
      xml: {
        xmlMode: true,
        decodeEntities: false,
      },
    })

    // 先收集再替换，避免替换过程中修改正在遍历的节点列表
    const textNodes: any[] = []
    const walk = (node: any) => {
      if (!node) {
        return
      }
      if (node.type === "text") {
        textNodes.push(node)
        return
      }
      if (node.type !== "tag" && node.type !== "root") {
        return
      }
      if (node.type === "tag" && SKIP_TAGS.has(String(node.name).toLowerCase())) {
        return
      }
      for (const child of node.children ?? []) {
        walk(child)
      }
    }
    walk($.root()[0])

    for (const node of textNodes) {
      const source = String(node.data ?? "")
      const replaced = HtmlMathUtils.replaceText(source, replacer)
      if (replaced !== source) {
        $(node).replaceWith(replaced)
      }
    }

    return $.html()
  }

  /**
   * 替换单个文本节点中的公式
   */
  private static replaceText(text: string, replacer: HtmlMathReplacer): string {
    return text.replace(MATH_PATTERN, (match, displayContent, inlineContent) => {
      const display = displayContent !== undefined
      const expression = String(display ? displayContent : inlineContent).trim()
      if (!expression) {
        return match
      }
      return replacer(expression, display) ?? match
    })
  }
}

export { HtmlMathUtils }
