/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { MediaObject, Post } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { CONTENT_LAYOUT_LEAF_BUNDLE, CONTENT_LAYOUT_SINGLE } from "~/src/adaptors/api/base/contentLayout.ts"
import { HugoConfig } from "~/src/adaptors/api/hugo/hugoConfig.ts"
import { HugoApiAdaptor } from "~/src/adaptors/api/hugo/hugoApiAdaptor.ts"

const createAdaptor = (contentLayout: string) => {
  const cfg = new HugoConfig("user", "token", "blog", "main")
  cfg.defaultPath = "content/post"
  cfg.blogid = "content/post"
  cfg.contentLayout = contentLayout as any
  cfg.previewPostUrl = "/post/[postid]/"

  const api = new HugoApiAdaptor(new PublisherAppInstance(), cfg)
  const calls: Array<{ method: string; args: any[] }> = []
  const client = {
    publishGithubPage: vi.fn(async (...args: any[]) => {
      calls.push({ method: "publish", args })
      return { content: { path: args[0], sha: "sha" } }
    }),
    updateGithubPage: vi.fn(async (...args: any[]) => {
      calls.push({ method: "update", args })
      return { content: { path: args[0], sha: "sha" } }
    }),
    getGithubPageTreeNode: vi.fn(async (dir: string) => {
      calls.push({ method: "tree", args: [dir] })
      return [
        { value: `${dir}/index.md`, label: "index.md", isLeaf: true },
        { value: `${dir}/cover.jpg`, label: "cover.jpg", isLeaf: false },
      ]
    }),
    deleteGithubPage: vi.fn(async (path: string) => {
      calls.push({ method: "delete", args: [path] })
      return { commit: { sha: "sha" } }
    }),
  }
  ;(api as any).githubClient = client
  return { api, cfg, calls }
}

const makePost = (): Post => {
  const post = new Post()
  post.title = "页面目录测试"
  post.wp_slug = "leaf-bundle-post"
  post.mdFilename = "leaf-bundle-post.md"
  post.description = "---\ntitle: 页面目录测试\n---\n\n正文"
  post.cate_slugs = ["content/post"]
  return post
}

describe("HugoApiAdaptor 页面目录（Leaf Bundle）", () => {
  it("newPost 写入 <存储目录>/<slug>/index.md", async () => {
    const { api, calls } = createAdaptor(CONTENT_LAYOUT_LEAF_BUNDLE)

    await api.newPost(makePost())

    expect(calls[0].method).toBe("publish")
    expect(calls[0].args[0]).toBe("content/post/leaf-bundle-post/index.md")
  })

  it("newMediaObject 把图片写入文章目录，正文链接用相对文件名", async () => {
    const { api, calls } = createAdaptor(CONTENT_LAYOUT_LEAF_BUNDLE)
    const post = makePost()
    const media = new MediaObject("封面图.jpg", "image/jpeg", new Uint8Array([1, 2, 3]))
    media.post = post

    const attachment = await api.newMediaObject(media)

    expect(calls[0].method).toBe("publish")
    expect(calls[0].args[0]).toBe("content/post/leaf-bundle-post/封面图.jpg")
    expect(attachment.url).toBe("封面图.jpg")
  })

  it("deletePost 同时删除 index.md 与同目录图片", async () => {
    const { api, calls } = createAdaptor(CONTENT_LAYOUT_LEAF_BUNDLE)

    await expect(api.deletePost("content/post/leaf-bundle-post/index.md")).resolves.toBe(true)

    expect(calls.filter((call) => call.method === "delete").map((call) => call.args[0])).toEqual([
      "content/post/leaf-bundle-post/index.md",
      "content/post/leaf-bundle-post/cover.jpg",
    ])
  })

  it("getPostPreviewUrl 对 index.md 取父目录作为 slug", async () => {
    const { api } = createAdaptor(CONTENT_LAYOUT_LEAF_BUNDLE)

    await expect(api.getPostPreviewUrl("content/post/leaf-bundle-post/index.md")).resolves.toBe(
      "/post/leaf-bundle-post/"
    )
  })

  it("单文件模式保持原有路径与图片链接行为", async () => {
    const { api, calls } = createAdaptor(CONTENT_LAYOUT_SINGLE)
    await api.newPost(makePost())

    const post = makePost()
    const media = new MediaObject("cover.jpg", "image/jpeg", new Uint8Array([1]))
    media.post = post
    const attachment = await api.newMediaObject(media)

    expect(calls[0].method).toBe("publish")
    expect(calls[0].args[0]).toBe("content/post/leaf-bundle-post.md")
    expect(calls[1].method).toBe("publish")
    expect(calls[1].args[0]).toBe("static/images/cover.jpg")
    expect(attachment.url).toBe("/images/cover.jpg")
  })
})
