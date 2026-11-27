/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import * as cheerio from "cheerio"

/**
 * 知乎代码块语言别名 → 知乎高亮语言标识。
 *
 * 知乎只识别 `<pre lang="<语言>">`；Lute 产出的 `<code class="language-xxx">`
 * 会被知乎清洗成纯文本。这里把常见写法归一到知乎保留的取值。
 */
const ZHIHU_CODE_LANGUAGE_ALIASES: Record<string, string> = {
  golang: "go",
  "c#": "csharp",
  cs: "csharp",
  "c++": "cpp",
  cplusplus: "cpp",
  objc: "objective-c",
  objectivec: "objective-c",
  yml: "yaml",
  markdown: "md",
  plaintext: "text",
}

const normalizeCodeLanguage = (raw?: string): string => {
  const language = (raw ?? "").trim().toLowerCase()
  if (!language) {
    return ""
  }
  // 只接受简单语言标识，避免把 CSS class 组合误当作语言
  if (!/^[\w#+.-]+$/.test(language)) {
    return ""
  }
  return ZHIHU_CODE_LANGUAGE_ALIASES[language] ?? language
}

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

  /**
   * 归一化代码块，保留语言以触发知乎语法高亮。
   *
   * 知乎正文只认 `<pre lang="go">`，而 Lute 输出的是
   * `<div class="code-block">…<pre><code class="hljs language-go">…</code></pre></div>`；
   * 直接把该结构交给知乎会被清洗成纯文本、语言丢失（issue #1713）。
   * 这里把代码块收敛成 `<pre lang="<语言>">代码文本</pre>`，并去掉
   * Lute 的 `protyle-*` 外壳（知乎编辑器不需要这些节点）。
   *
   * @param html - 包含代码块的 HTML 字符串
   * @returns 处理后的 HTML 字符串（片段形式，不含 html/body 包裹）
   */
  public static processZHCodeBlock(html: string): string {
    if (!html) {
      return html
    }

    const $ = cheerio.load(html)

    $("pre").each((_, element) => {
      const pre = $(element)
      const code = pre.find("code").first()
      const language = ZhihuUtils.resolveCodeLanguage(pre, code)
      const codeText = code.length > 0 ? code.text() : pre.text()

      const normalized = $("<pre></pre>")
      if (language) {
        normalized.attr("lang", language)
      }
      normalized.text(codeText)

      // Lute 的代码块带 protyle 操作栏；整块替换掉，避免语言标签混进正文
      const codeBlock = pre.closest(".code-block")
      if (codeBlock.length > 0) {
        codeBlock.replaceWith(normalized)
      } else {
        pre.replaceWith(normalized)
      }
    })

    // 返回片段：前面步骤可能引入 html/body 包裹，知乎正文不需要
    return $("body").html() ?? html
  }

  /**
   * 从 Lute/通用 HTML 代码块结构里解析语言标识
   */
  private static resolveCodeLanguage(pre: cheerio.Cheerio<any>, code: cheerio.Cheerio<any>): string {
    const attributes = ["data-language", "data-subtype", "data-info"]
    for (const attribute of attributes) {
      const language = normalizeCodeLanguage(code.attr(attribute)) || normalizeCodeLanguage(pre.attr(attribute))
      if (language) {
        return language
      }
    }

    const declaredLanguage = normalizeCodeLanguage(pre.attr("lang"))
    if (declaredLanguage) {
      return declaredLanguage
    }

    for (const classHint of [code.attr("class"), pre.attr("class")]) {
      const matched = classHint?.match(/(?:^|\s)language-([\w#+.-]+)/i)
      const language = normalizeCodeLanguage(matched?.[1])
      if (language) {
        return language
      }
    }

    const actionLanguage = pre.closest(".code-block").find(".protyle-action__language").first().text()
    return normalizeCodeLanguage(actionLanguage)
  }
}

export default ZhihuUtils
