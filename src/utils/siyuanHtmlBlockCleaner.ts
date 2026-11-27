/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { SiyuanKernelApi } from "zhi-siyuan-api"

/**
 * 思源 HTML 块清理（issue #1905）。
 *
 * siyuan-oembed 等插件把卡片写成思源的 HTML 块（`type = html`）。这类块不在
 * 挂件 iframe 的清理规则内，会原样出现在导出的 Markdown 里。这里按块内容从
 * Markdown 中移除 HTML 块，而不是匹配某个插件的 class 或文案，后续同类插件
 * 写入的 HTML 块也能覆盖。
 */

type FenceState = boolean[]

type SqlCapableKernelApi = Pick<SiyuanKernelApi, "sql">

/**
 * 归一化 HTML 块内容：统一换行、去掉每行首尾空白，并丢弃首尾空行。
 *
 * 思源导出 Markdown 时可能给列表内的 HTML 块统一加缩进，但块内容本身不变，
 * 因此比较时忽略行首空白，删除时仍按原 Markdown 行删除。
 */
const normalizeBlockContentLines = (content: string): string[] => {
  if (!content) {
    return []
  }
  const lines = content.replace(/\r\n?/g, "\n").split("\n").map((line) => line.trim())
  while (lines.length > 0 && lines[0] === "") {
    lines.shift()
  }
  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop()
  }
  return lines
}

/**
 * 标记 Markdown 中位于围栏代码块内的行，避免误删代码示例里的相同 HTML。
 */
const computeFenceState = (lines: readonly string[]): FenceState => {
  const state: FenceState = new Array(lines.length).fill(false)
  let fence: { marker: string; length: number } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = /^\s{0,3}(`{3,}|~{3,})/.exec(line)

    if (fence) {
      state[i] = true
      if (match && match[1][0] === fence.marker && match[1].length >= fence.length) {
        fence = null
      }
    } else if (match) {
      state[i] = true
      fence = { marker: match[1][0], length: match[1].length }
    }
  }

  return state
}

/**
 * 从 Markdown 中移除指定 HTML 块的内容。
 *
 * @param markdown - 思源导出的 Markdown
 * @param blockContents - HTML 块的原始内容（通常来自思源 blocks 表）
 * @returns 移除 HTML 块后的 Markdown
 */
export const removeHtmlBlocksFromMarkdown = (
  markdown: string,
  blockContents: readonly string[]
): string => {
  if (!markdown || blockContents.length === 0) {
    return markdown
  }

  const lines = markdown.split("\n")

  for (const content of blockContents) {
    const blockLines = normalizeBlockContentLines(content)
    if (blockLines.length === 0) {
      continue
    }

    const fenceState = computeFenceState(lines)
    let start = -1

    for (let i = 0; i <= lines.length - blockLines.length; i++) {
      if (fenceState[i]) {
        continue
      }
      if (lines[i].trim() !== blockLines[0]) {
        continue
      }

      let matched = true
      for (let j = 1; j < blockLines.length; j++) {
        if (lines[i + j].trim() !== blockLines[j]) {
          matched = false
          break
        }
      }

      if (matched) {
        start = i
        break
      }
    }

    if (start < 0) {
      continue
    }

    lines.splice(start, blockLines.length)

    // 删除后如果前后都是空行，合并成一行，避免留下大段空白。
    if (start > 0 && start < lines.length && lines[start - 1].trim() === "" && lines[start].trim() === "") {
      lines.splice(start, 1)
    }
  }

  return lines.join("\n")
}

/**
 * 查询文档中的 HTML 块内容。
 *
 * 只查询当前文档的块；思源会按文档 root_id 维护块树，列表/超级块内的 HTML 块
 * 同样能查到。
 *
 * @param kernelApi - 思源内核 API
 * @param docId - 文档 ID
 * @returns HTML 块原始内容列表
 */
export const loadHtmlBlockContents = async (
  kernelApi: SqlCapableKernelApi,
  docId: string
): Promise<string[]> => {
  if (!docId) {
    return []
  }

  const escapedDocId = docId.replace(/'/g, "''")
  const rows = await kernelApi.sql(
    `SELECT content FROM blocks WHERE root_id = '${escapedDocId}' AND type = 'html' ORDER BY sort ASC`
  )

  if (!Array.isArray(rows)) {
    return []
  }

  return rows
    .map((row) => {
      if (!row || typeof row !== "object" || !("content" in row)) {
        return ""
      }
      return String((row as { content?: unknown }).content ?? "")
    })
    .filter((content) => content.trim() !== "")
}

/**
 * 查询并移除文档中的 HTML 块。
 *
 * @param kernelApi - 思源内核 API
 * @param docId - 文档 ID
 * @param markdown - 思源导出的 Markdown
 * @returns 清理后的 Markdown
 */
export const removeHtmlBlocksFromSiyuanMarkdown = async (
  kernelApi: SqlCapableKernelApi,
  docId: string,
  markdown: string
): Promise<string> => {
  const blockContents = await loadHtmlBlockContents(kernelApi, docId)
  return removeHtmlBlocksFromMarkdown(markdown, blockContents)
}
