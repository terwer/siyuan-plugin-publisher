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
import {
  applyDocMetadataOverrides,
  clearOverridesMatchingDoc,
  extractSiyuanMetadata,
  getMetadataOverrides,
  markMetadataOverride,
  parseMetadataOverrides,
  serializeMetadataOverrides,
  type PublishMetadataPost,
} from "~/src/utils/publishMetadata.ts"

const createDoc = () => {
  const post = new Post()
  post.title = "文档标题"
  post.shortDesc = "文档摘要"
  post.mt_keywords = "标签甲,标签乙"
  post.categories = ["分类甲", "分类乙"]
  post.dateCreated = new Date("2026-01-01T00:00:00.000Z")
  post.dateUpdated = new Date("2026-05-05T00:00:00.000Z")
  return post as PublishMetadataPost
}

describe("publishMetadata util", () => {
  it("提取思源文档元数据快照，数组和日期是副本", () => {
    const doc = createDoc()
    const snapshot = extractSiyuanMetadata(doc)

    expect(snapshot).toEqual({
      title: "文档标题",
      shortDesc: "文档摘要",
      mt_keywords: "标签甲,标签乙",
      categories: ["分类甲", "分类乙"],
      dateCreated: doc.dateCreated,
      dateUpdated: doc.dateUpdated,
    })
    expect(snapshot.categories).not.toBe(doc.categories)
  })

  it("解析覆盖集合时过滤未知字段与非法 JSON", () => {
    expect([...parseMetadataOverrides('["title","dateUpdated","unknown"]')]).toEqual(["title", "dateUpdated"])
    expect(parseMetadataOverrides("{bad").size).toBe(0)
    expect(parseMetadataOverrides(undefined).size).toBe(0)
    expect(serializeMetadataOverrides(["title", "title", "tags"] as any)).toBe('["title","tags"]')
  })

  it("标记覆盖字段会去重并保存到文章上", () => {
    const post = createDoc()
    markMetadataOverride(post, "title")
    markMetadataOverride(post, "title")
    markMetadataOverride(post, "dateUpdated")

    expect([...getMetadataOverrides(post)]).toEqual(["title", "dateUpdated"])
  })

  it("未覆盖字段回填思源文档，覆盖字段保留平台侧值", () => {
    const post = createDoc()
    post.siyuanMetadata = extractSiyuanMetadata(post)
    post.title = "平台标题"
    post.shortDesc = "平台摘要"
    post.mt_keywords = "平台标签"
    post.categories = ["平台分类"]
    post.dateCreated = new Date("2025-01-01T00:00:00.000Z")
    post.dateUpdated = new Date("2025-01-02T00:00:00.000Z")
    post.metadataOverrides = ["title", "dateUpdated"]

    const result = applyDocMetadataOverrides(post) as PublishMetadataPost

    expect(result.title).toBe("平台标题")
    expect(result.shortDesc).toBe("文档摘要")
    expect(result.mt_keywords).toBe("标签甲,标签乙")
    expect(result.categories).toEqual(["分类甲", "分类乙"])
    expect(result.dateCreated?.toISOString()).toBe("2026-01-01T00:00:00.000Z")
    expect(result.dateUpdated?.toISOString()).toBe("2025-01-02T00:00:00.000Z")
  })

  it("覆盖值改回文档值时移除覆盖，否则保留", () => {
    const post = createDoc()
    post.siyuanMetadata = extractSiyuanMetadata(post)
    post.title = "文档标题"
    post.mt_keywords = "平台标签"
    post.metadataOverrides = ["title", "tags"]

    const remaining = clearOverridesMatchingDoc(post)

    expect(remaining).toEqual(["tags"])
  })

  it("没有文档快照时保持已有覆盖集合", () => {
    const post = createDoc()
    post.metadataOverrides = ["title", "tags"]

    expect(clearOverridesMatchingDoc(post)).toEqual(["title", "tags"])
  })
})
