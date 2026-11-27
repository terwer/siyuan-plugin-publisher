/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { type DiagramLanguage, normalizeDiagramLanguage } from "~/src/utils/diagram/diagramTypes.ts"

export interface DiagramFence {
  language: DiagramLanguage
  code: string
  /** 起始偏移（含缩进） */
  start: number
  /** 结束偏移（闭合围栏行末，不含换行） */
  end: number
  /** 原始代码块文本，用于上传失败回退 */
  fenceText: string
  /** 围栏前导缩进（列表内代码块） */
  indent: string
}

interface SourceLine {
  start: number
  /** 行内容（不含换行和行尾 \r） */
  text: string
  /** 下一行起始偏移 */
  next: number
}

const OPEN_FENCE_RE = /^( {0,3})(`{3,}|~{3,})(.*)$/
const CLOSE_FENCE_RE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/

const splitLines = (markdown: string): SourceLine[] => {
  const lines: SourceLine[] = []
  let start = 0
  while (start <= markdown.length) {
    let next = markdown.indexOf("\n", start)
    if (next < 0) {
      next = markdown.length
    } else {
      next += 1
    }
    const rawEnd = next > 0 && markdown[next - 1] === "\n" ? next - 1 : next
    const end = rawEnd > start && markdown[rawEnd - 1] === "\r" ? rawEnd - 1 : rawEnd
    lines.push({ start, text: markdown.slice(start, end), next })
    if (next >= markdown.length) {
      break
    }
    start = next
  }
  return lines
}

/**
 * 去掉围栏缩进（最多 `indent.length` 个空格）。
 *
 * 代码块可以出现在列表/引用内，信息内容通常跟随围栏缩进；去掉与围栏相同的
 * 前导空格后，图表代码才能按用户书写的样子交给渲染器。
 */
const stripIndent = (lines: string[], indent: string): string => {
  if (!indent) {
    return lines.join("\n")
  }
  const width = indent.length
  return lines
    .map((line) => {
      let index = 0
      while (index < width && line[index] === " ") {
        index += 1
      }
      return line.slice(index)
    })
    .join("\n")
}

/**
 * 查找正文中所有可转换的文本图围栏。
 *
 * 只识别以 ``` 或 ~~~ 开头的围栏；未闭合围栏按 Markdown 语义忽略。
 * 返回的偏移直接对应原字符串，便于 `applyDiagramReplacements` 精确替换。
 */
export const findDiagramFences = (markdown: string): DiagramFence[] => {
  if (!markdown) {
    return []
  }
  const lines = splitLines(markdown)
  const fences: DiagramFence[] = []
  for (let i = 0; i < lines.length; i += 1) {
    const open = lines[i]
    const openMatch = open.text.match(OPEN_FENCE_RE)
    if (!openMatch) {
      continue
    }
    const indent = openMatch[1] ?? ""
    const marker = openMatch[2]
    const language = normalizeDiagramLanguage(openMatch[3])
    const contentLines: string[] = []
    let closeIndex = -1
    for (let j = i + 1; j < lines.length; j += 1) {
      const closeMatch = lines[j].text.match(CLOSE_FENCE_RE)
      if (closeMatch && closeMatch[1][0] === marker[0] && closeMatch[1].length >= marker.length) {
        closeIndex = j
        break
      }
      contentLines.push(lines[j].text)
    }
    if (closeIndex < 0) {
      // 未闭合围栏，按普通文本处理
      break
    }
    if (language) {
      const fenceText = markdown.slice(open.start, lines[closeIndex].start + lines[closeIndex].text.length)
      const code = stripIndent(contentLines, indent).replace(/\r\n/g, "\n").trimEnd()
      if (code.trim()) {
        fences.push({
          language,
          code,
          start: open.start,
          end: lines[closeIndex].start + lines[closeIndex].text.length,
          fenceText,
          indent,
        })
      }
    }
    i = closeIndex
  }
  return fences
}

export interface TextReplacement {
  start: number
  end: number
  text: string
}

/**
 * 按偏移替换文本，自动从后往前应用，避免偏移失效。
 */
export const applyDiagramReplacements = (markdown: string, replacements: TextReplacement[]): string => {
  if (!replacements.length) {
    return markdown
  }
  const sorted = [...replacements].sort((a, b) => b.start - a.start)
  let result = markdown
  let lastStart = markdown.length + 1
  for (const item of sorted) {
    if (item.start < 0 || item.end < item.start || item.end > markdown.length || item.end > lastStart) {
      continue
    }
    result = result.slice(0, item.start) + item.text + result.slice(item.end)
    lastStart = item.start
  }
  return result
}
