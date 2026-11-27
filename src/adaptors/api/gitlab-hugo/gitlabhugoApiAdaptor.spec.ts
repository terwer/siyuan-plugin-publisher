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
import { CONTENT_LAYOUT_LEAF_BUNDLE } from "~/src/adaptors/api/base/contentLayout.ts"
import { GitlabhugoConfig } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoConfig.ts"
import { GitlabhugoApiAdaptor } from "~/src/adaptors/api/gitlab-hugo/gitlabhugoApiAdaptor.ts"

const createAdaptor = () => {
  const cfg = new GitlabhugoConfig("user", "token", "blog", "main")
  cfg.home = "http://localhost:8002"
  cfg.apiUrl = "http://localhost:8002"
  cfg.defaultPath = "content/post"
  cfg.blogid = "content/post"
  cfg.contentLayout = CONTENT_LAYOUT_LEAF_BUNDLE
  cfg.previewPostUrl = "/post/[postid]/"

  const api = new GitlabhugoApiAdaptor(new PublisherAppInstance(), cfg)
  const calls: Array<{ method: string; args: any[] }> = []
  const client = {
    createRepositoryFile: vi.fn(async (...args: any[]) => {
      calls.push({ method: "create", args })
      return { file_path: args[0] }
    }),
    getRepositoryTree: vi.fn(async (dir: string) => {
      calls.push({ method: "tree", args: [dir] })
      return [
        { value: `${dir}/index.md`, label: "index.md", isLeaf: true },
        { value: `${dir}/cover.jpg`, label: "cover.jpg", isLeaf: false },
      ]
    }),
    deleteRepositoryFile: vi.fn(async (path: string) => {
      calls.push({ method: "delete", args: [path] })
      return true
    }),
  }
  ;(api as any).gitlabClient = client
  return { api, calls }
}

const makePost = (): Post => {
  const post = new Post()
  post.title = "GitLab 页面目录测试"
  post.wp_slug = "leaf-bundle-post"
  post.mdFilename = "leaf-bundle-post.md"
  post.description = "---\ntitle: GitLab 页面目录测试\n---\n\n正文"
  post.cate_slugs = ["content/post"]
  return post
}

describe("GitlabhugoApiAdaptor 页面目录（Leaf Bundle）", () => {
  it("newPost 写入 <存储目录>/<slug>/index.md", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(makePost())

    expect(calls[0].method).toBe("create")
    expect(calls[0].args[0]).toBe("content/post/leaf-bundle-post/index.md")
  })

  it("newMediaObject 把图片写入文章目录，正文链接用相对文件名（不是 GitLab raw 绝对地址）", async () => {
    const { api, calls } = createAdaptor()
    const post = makePost()
    const media = new MediaObject("cover.jpg", "image/jpeg", new Uint8Array([1, 2, 3]))
    media.post = post

    const attachment = await api.newMediaObject(media)

    expect(calls[0].method).toBe("create")
    expect(calls[0].args[0]).toBe("content/post/leaf-bundle-post/cover.jpg")
    expect(attachment.url).toBe("cover.jpg")
  })

  it("deletePost 同时删除 index.md 与同目录图片", async () => {
    const { api, calls } = createAdaptor()

    await expect(api.deletePost("content/post/leaf-bundle-post/index.md")).resolves.toBe(true)

    expect(calls.filter((call) => call.method === "delete").map((call) => call.args[0])).toEqual([
      "content/post/leaf-bundle-post/index.md",
      "content/post/leaf-bundle-post/cover.jpg",
    ])
  })

  it("getPostPreviewUrl 对 index.md 取父目录作为 slug", async () => {
    const { api } = createAdaptor()

    await expect(api.getPostPreviewUrl("content/post/leaf-bundle-post/index.md")).resolves.toBe(
      "/post/leaf-bundle-post/"
    )
  })
})
