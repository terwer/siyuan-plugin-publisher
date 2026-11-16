/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { Post } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { CnblogsApiAdaptor } from "~/src/adaptors/api/cnblogs/cnblogsApiAdaptor.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"

const NEW_POST_METHOD = MetaweblogConstants.METHOD_NEW_POST

/**
 * 构造一个把 XML-RPC 调用记录在内存里的适配器，避免单测依赖真实博客园站点
 */
const createAdaptor = () => {
  const cfg = new CnblogsConfig("https://rpc.cnblogs.com/metaweblog/demo", "user", "password")
  const api = new CnblogsApiAdaptor(new PublisherAppInstance(), cfg)

  const calls: Array<{ method: string; params: any[] }> = []
  const metaweblogCall = vi.fn(async (method: string, params: any[]) => {
    calls.push({ method, params })
    return method === NEW_POST_METHOD ? "1" : true
  })
  ;(api as any).metaweblogCall = metaweblogCall

  return { api, calls }
}

/**
 * 发布一篇文章，返回真正提交给博客园的分类数组
 */
const publishWithCategories = async (categories: string[]) => {
  const { api, calls } = createAdaptor()
  const post = new Post()
  post.title = "分类顺序测试"
  post.description = "<p>正文</p>"
  post.categories = categories

  await api.newPost(post)

  const call = calls.find((item) => item.method === NEW_POST_METHOD)
  expect(call).toBeTruthy()
  return call!.params[3].categories as string[]
}

describe("test cnblogsApiAdaptor categories", () => {
  it("puts [Markdown] first and the chosen content type last", async () => {
    const categories = await publishWithCategories(["[文章分类]docker-app", "[发布为文章]"])

    expect(categories).toEqual(["[Markdown]", "[文章分类]docker-app", "[发布为文章]"])
  })

  it("moves [Markdown] away from the last position", async () => {
    const categories = await publishWithCategories(["[发布为文章]", "[Markdown]"])

    expect(categories).toEqual(["[Markdown]", "[发布为文章]"])
  })

  it("keeps the homepage marker before the content type marker", async () => {
    const categories = await publishWithCategories(["[发布至博客园首页]", "[发布为文章]", "[随笔分类]Android"])

    expect(categories).toEqual(["[Markdown]", "[随笔分类]Android", "[发布至博客园首页]", "[发布为文章]"])
  })

  it("drops duplicates and blank categories but keeps the user order", async () => {
    const categories = await publishWithCategories([
      "  [发布为文章]  ",
      "[发布为文章]",
      "[Markdown]",
      "",
      "[随笔分类]Android",
    ])

    expect(categories).toEqual(["[Markdown]", "[随笔分类]Android", "[发布为文章]"])
  })

  it("keeps a pure note as an essay with markdown enabled", async () => {
    const categories = await publishWithCategories(["[随笔分类]Android"])

    expect(categories).toEqual(["[Markdown]", "[随笔分类]Android"])
  })
})
