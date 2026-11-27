/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  chunkNotionBlocks,
  markdownToNotionBlocks,
  NOTION_MAX_BLOCKS_PER_REQUEST,
} from "~/src/adaptors/api/notion/notionBlocks.ts"

const markdownWithParagraphs = (count: number): string =>
  Array.from({ length: count }, (_, index) => `第 ${index + 1} 段`).join("\n\n")

describe("notionBlocks", () => {
  it("keeps every block instead of truncating long documents", () => {
    const blocks = markdownToNotionBlocks(markdownWithParagraphs(1005))

    expect(blocks).toHaveLength(1005)
  })

  it("splits blocks into ordered batches that never exceed the Notion limit", () => {
    const blocks = markdownToNotionBlocks(markdownWithParagraphs(250))
    const batches = chunkNotionBlocks(blocks)

    expect(batches.map((batch) => batch.length)).toEqual([100, 100, 50])
    expect(batches.flat()).toEqual(blocks)
    expect(Math.max(...batches.map((batch) => batch.length))).toBe(NOTION_MAX_BLOCKS_PER_REQUEST)
  })

  it("keeps an exactly full batch as a single request", () => {
    const batches = chunkNotionBlocks(markdownToNotionBlocks(markdownWithParagraphs(100)))

    expect(batches).toHaveLength(1)
    expect(batches[0]).toHaveLength(100)
  })

  it("returns no batches for empty content", () => {
    expect(chunkNotionBlocks([])).toEqual([])
  })

  it("rejects an invalid batch size", () => {
    expect(() => chunkNotionBlocks([], 0)).toThrow(/greater than 0/)
  })
})
