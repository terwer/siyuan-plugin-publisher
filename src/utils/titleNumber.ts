/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 标题编号处理。
 *
 * 思源「标题块自动编号」在导出 Markdown 时会把编号写进标题文本（`1`、`1.1`、`1.1.1`，
 * 中文序号模板还会出现 `一、`/`（一）` 等形态）。插件「去除标题编号」需要在
 * 文档标题与正文标题两个位置都能识别这些编号（issue #2054）。
 */

const CN_NUMBER = "[一二三四五六七八九十百千零〇两]+"

/**
 * 标题开头的编号形态，按「越具体越先匹配」排序。
 *
 * 纯数字后跟空白的形态只接受 1-2 位，避免把「2024 年度总结」这类真实标题误判成编号。
 */
const LEADING_NUMBER_REGEXES: RegExp[] = [
  // 多级十进制编号：1.1 / 1.1.1 / 1.1.
  /^\d+(?:[.．]\d+)+[.．、)）]?\s*/,
  // 单级十进制编号带分隔符：1. / 1、 / 1) / 1）
  /^\d{1,2}[.．、)）]\s*/,
  // 括号编号：（1） / (1)
  /^[（(]\s*\d{1,3}\s*[)）]\s*/,
  // 括号中文编号：（一） / (一)
  new RegExp(`^[（(]\\s*${CN_NUMBER}\\s*[)）]\\s*`),
  // 中文数字编号：一、 / 一.
  new RegExp(`^${CN_NUMBER}[、.．]\\s*`),
  // 字母编号：A. / a) / ab、
  /^[A-Za-z]{1,2}[.．、)）]\s*/,
  // 纯数字 + 空白：思源单级模板导出为「1 标题」
  /^\d{1,2}\s+/,
]

/**
 * 去掉标题开头的编号，返回不含编号的标题。
 *
 * @param title 标题文本
 */
export const removeTitleNumber = (title: string): string => {
  if (!title) {
    return ""
  }
  let result = title.trimStart()
  for (const regex of LEADING_NUMBER_REGEXES) {
    const stripped = result.replace(regex, "")
    // 整段都是编号时不做替换，避免把标题清空
    if (stripped !== result && stripped.trim() !== "") {
      result = stripped.trimStart()
      break
    }
  }
  return result
}

const FENCE_REGEX = /^\s*(```|~~~)/
const HEADING_REGEX = /^(#{1,6})([ \t]+)(.*)$/

/**
 * 去掉 Markdown 正文中各级标题开头的编号（代码块内不处理）。
 *
 * @param markdown Markdown 正文
 */
export const removeMarkdownHeadingNumbers = (markdown: string): string => {
  if (!markdown) {
    return ""
  }

  let inFence = false
  const lines = markdown.split("\n").map((line) => {
    if (FENCE_REGEX.test(line)) {
      inFence = !inFence
      return line
    }
    if (inFence) {
      return line
    }

    const matched = HEADING_REGEX.exec(line)
    if (!matched) {
      return line
    }
    const [, hashes, space, text] = matched
    const stripped = removeTitleNumber(text)
    if (stripped === text || stripped.trim() === "") {
      return line
    }
    return `${hashes}${space}${stripped}`
  })

  return lines.join("\n")
}
