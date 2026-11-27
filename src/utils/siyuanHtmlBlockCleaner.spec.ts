/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import {
  loadHtmlBlockContents,
  removeHtmlBlocksFromMarkdown,
  removeHtmlBlocksFromSiyuanMarkdown,
} from "~/src/utils/siyuanHtmlBlockCleaner.ts"

const CARD = [
  "<div>",
  '  <style>.kg-card { color: red; }</style>',
  '  <main class="kg-card-main">',
  '    <a class="kg-bookmark-container" href="https://example.com/post">Example post</a>',
  "  </main>",
  "</div>",
].join("\n")

describe("siyuanHtmlBlockCleaner", () => {
  it("移除顶层 HTML 块并保留前后正文", () => {
    const markdown = ["# 标题", "", "前面", "", CARD, "", "后面"].join("\n")

    const result = removeHtmlBlocksFromMarkdown(markdown, [CARD])

    expect(result).not.toContain("<style>")
    expect(result).not.toContain("kg-card")
    expect(result).toContain("前面")
    expect(result).toContain("后面")
    expect(result).toContain("# 标题")
  })

  it("清除列表项内部被统一缩进的 HTML 块", () => {
    const indentedCard = CARD.split("\n")
      .map((line) => `    ${line}`)
      .join("\n")
    const markdown = ["- 列表项", "", indentedCard, "", "结尾"].join("\n")

    const result = removeHtmlBlocksFromMarkdown(markdown, [CARD])

    expect(result).not.toContain("kg-card")
    expect(result).toContain("- 列表项")
    expect(result).toContain("结尾")
  })

  it("一次移除多个 HTML 块", () => {
    const secondCard = CARD.replace("Example post", "Second post")
    const markdown = ["开头", "", CARD, "", "中间", "", secondCard, "", "结尾"].join("\n")

    const result = removeHtmlBlocksFromMarkdown(markdown, [CARD, secondCard])

    expect(result).not.toContain("kg-card")
    expect(result).not.toContain("Second post")
    expect(result).toContain("开头")
    expect(result).toContain("中间")
    expect(result).toContain("结尾")
  })

  it("保留围栏代码块内的相同 HTML 示例，只删除真正的 HTML 块", () => {
    const markdown = ["```html", CARD, "```", "", "正文", "", CARD, "", "结尾"].join("\n")

    const result = removeHtmlBlocksFromMarkdown(markdown, [CARD])

    expect(result).toContain("```html")
    expect(result).toContain("kg-card")
    expect(result.match(/<div>/g)).toHaveLength(1)
    expect(result).toContain("结尾")
  })

  it("未匹配到 HTML 块时保持原文不变", () => {
    const markdown = "# 标题\n\n正文"

    expect(removeHtmlBlocksFromMarkdown(markdown, [CARD])).toBe(markdown)
  })

  it("没有 HTML 块内容时保持原文不变", () => {
    const markdown = "# 标题\n\n正文"

    expect(removeHtmlBlocksFromMarkdown(markdown, [])).toBe(markdown)
  })

  it("loadHtmlBlockContents 查询当前文档的 html 块并忽略空内容", async () => {
    const sql = vi.fn(async (_sql: string) => [{ content: CARD }, { content: "" }, null])

    const contents = await loadHtmlBlockContents({ sql } as any, "20261127144106-fbw38wl")

    expect(contents).toEqual([CARD])
    expect(sql).toHaveBeenCalledTimes(1)
    expect(sql.mock.calls[0][0]).toContain("root_id = '20261127144106-fbw38wl'")
    expect(sql.mock.calls[0][0]).toContain("type = 'html'")
  })

  it("removeHtmlBlocksFromSiyuanMarkdown 组合查询与清理", async () => {
    const sql = vi.fn(async () => [{ content: CARD }])
    const markdown = ["正文", "", CARD, "", "结尾"].join("\n")

    const result = await removeHtmlBlocksFromSiyuanMarkdown(
      { sql } as any,
      "20261127144106-fbw38wl",
      markdown
    )

    expect(result).not.toContain("kg-card")
    expect(result).toContain("正文")
    expect(result).toContain("结尾")
  })
})
