/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { Post } from "zhi-blog-api"
import { normalizePlatformPostMetadata } from "~/src/adaptors/base/platformPostMetadata.ts"

describe("normalizePlatformPostMetadata", () => {
  it("fills shortDesc from mt_excerpt for Astro/Docsify readback", () => {
    const post = new Post()
    post.mt_excerpt = "平台摘要"

    const normalized = normalizePlatformPostMetadata(post)

    expect(normalized.shortDesc).toBe("平台摘要")
    expect(normalized.mt_excerpt).toBe("平台摘要")
    expect(normalized.mt_text_more).toBe("平台摘要")
  })

  it("fills mt_excerpt from shortDesc for Vuepress/Hugo readback", () => {
    const post = new Post()
    post.shortDesc = "平台摘要"

    const normalized = normalizePlatformPostMetadata(post)

    expect(normalized.shortDesc).toBe("平台摘要")
    expect(normalized.mt_excerpt).toBe("平台摘要")
  })

  it("does not overwrite an existing summary field", () => {
    const post = new Post()
    post.shortDesc = "short"
    post.mt_excerpt = "excerpt"

    const normalized = normalizePlatformPostMetadata(post)

    expect(normalized.shortDesc).toBe("short")
    expect(normalized.mt_excerpt).toBe("excerpt")
  })

  it("normalizes tags from arrays and malformed strings", () => {
    const post = new Post()
    post.mt_keywords = ["标签甲", "标签乙,标签丙"] as unknown as string

    const normalized = normalizePlatformPostMetadata(post)

    expect(normalized.mt_keywords).toBe("标签甲,标签乙,标签丙")
  })
})
