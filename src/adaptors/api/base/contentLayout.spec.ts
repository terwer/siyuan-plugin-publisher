/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  CONTENT_LAYOUT_LEAF_BUNDLE,
  CONTENT_LAYOUT_SINGLE,
  dirnameRepoPath,
  isLeafBundleLayout,
  isLeafBundlePostPath,
  joinRepoPath,
  resolveHugoBundleUrl,
  resolveHugoSection,
  resolveLeafBundleImageLink,
  resolveLeafBundleImagePath,
  resolveLeafBundleImagePathForPost,
  resolveLeafBundlePostPath,
  resolvePostMdFilename,
  resolvePreviewSlug,
  stripMarkdownExtension,
  usesLeafBundleForPost,
} from "~/src/adaptors/api/base/contentLayout.ts"

describe("Hugo 内容组织方式（Content Layout）", () => {
  describe("布局判定", () => {
    it("默认与显式单文件都按单文件处理", () => {
      expect(isLeafBundleLayout(undefined)).toBe(false)
      expect(isLeafBundleLayout({})).toBe(false)
      expect(isLeafBundleLayout({ contentLayout: CONTENT_LAYOUT_SINGLE })).toBe(false)
    })

    it("leaf-bundle 才启用页面目录", () => {
      expect(isLeafBundleLayout({ contentLayout: CONTENT_LAYOUT_LEAF_BUNDLE })).toBe(true)
    })

    it("按文章实际形态决定本次是否按页面目录处理", () => {
      const bundleCfg = { contentLayout: CONTENT_LAYOUT_LEAF_BUNDLE }
      expect(usesLeafBundleForPost(bundleCfg, {})).toBe(true)
      expect(usesLeafBundleForPost(bundleCfg, { postid: "content/post/new/index.md" })).toBe(true)
      // 平台切到 bundle 后，更新旧的单文件文章仍走单文件，避免断图
      expect(usesLeafBundleForPost(bundleCfg, { postid: "content/post/old.md" })).toBe(false)
      expect(usesLeafBundleForPost({ contentLayout: CONTENT_LAYOUT_SINGLE }, {})).toBe(false)
    })
  })

  describe("文章路径", () => {
    it("默认 [slug].md → <存储目录>/<slug>/index.md", () => {
      expect(resolveLeafBundlePostPath("content/post", "my-post.md")).toBe("content/post/my-post/index.md")
    })

    it("含中文目录名与 .markdown 扩展名也能正确推导", () => {
      expect(resolveLeafBundlePostPath("content/posts/", "我的第一篇文章.markdown")).toBe(
        "content/posts/我的第一篇文章/index.md"
      )
    })

    it("文件规则包含子目录时，子目录保留", () => {
      expect(resolveLeafBundlePostPath("content/posts", "2026/07/my-post.md")).toBe(
        "content/posts/2026/07/my-post/index.md"
      )
    })

    it("mdFilename 缺失时用 slug 兜底，保证图片与文章使用同一目录", () => {
      expect(resolvePostMdFilename({ wp_slug: "fallback-slug" })).toBe("fallback-slug.md")
      expect(resolveLeafBundlePostPath("content/post", resolvePostMdFilename({ wp_slug: "fallback-slug" }))).toBe(
        "content/post/fallback-slug/index.md"
      )
    })
  })

  describe("图片路径与链接", () => {
    it("图片与 index.md 同目录，正文链接使用相对文件名", () => {
      expect(resolveLeafBundleImagePath("content/post", "my-post.md", "cover.jpg")).toBe(
        "content/post/my-post/cover.jpg"
      )
      expect(resolveLeafBundleImageLink("cover.jpg")).toBe("cover.jpg")
    })

    it("中文图片名不会被改写", () => {
      expect(resolveLeafBundleImagePath("content/posts", "文章.md", "封面图.png")).toBe(
        "content/posts/文章/封面图.png"
      )
    })

    it("更新已发布文章时优先沿用 postid 所在目录，避免 mdFilename 变化造成断图", () => {
      expect(
        resolveLeafBundleImagePathForPost(
          { postid: "content/post/old-dir/index.md", mdFilename: "new-slug.md" },
          "cover.jpg"
        )
      ).toBe("content/post/old-dir/cover.jpg")
    })

    it("新建文章时按分类目录 + mdFilename 推导图片目录", () => {
      expect(
        resolveLeafBundleImagePathForPost(
          { mdFilename: "new-slug.md", cate_slugs: ["content/post"] },
          "cover.jpg"
        )
      ).toBe("content/post/new-slug/cover.jpg")
    })
  })

  describe("预览与站点 URL", () => {
    it("页面目录的 postid 取父目录名作为 slug", () => {
      expect(resolvePreviewSlug("content/posts/my-post/index.md")).toBe("my-post")
      expect(isLeafBundlePostPath("content/posts/my-post/index.md")).toBe(true)
    })

    it("单文件 postid 仍取文件名（保持既有行为）", () => {
      expect(resolvePreviewSlug("content/posts/my-post.md")).toBe("my-post")
      expect(isLeafBundlePostPath("content/posts/my-post.md")).toBe(false)
    })

    it("section 去掉 content/ 前缀", () => {
      expect(resolveHugoSection({ defaultPath: "content/posts" })).toBe("posts")
      expect(resolveHugoSection({ defaultPath: "content" })).toBe("")
      expect(resolveHugoSection({ defaultPath: "posts" })).toBe("posts")
      expect(resolveHugoSection({ defaultPath: "/content/post/" })).toBe("post")
    })

    it("目录式 Front Matter url 按存储目录推导", () => {
      expect(resolveHugoBundleUrl({ defaultPath: "content/posts" }, "my-post")).toBe("/posts/my-post/")
      expect(resolveHugoBundleUrl({ defaultPath: "content/post" }, "my-post")).toBe("/post/my-post/")
      expect(resolveHugoBundleUrl({ defaultPath: "content" }, "my-post")).toBe("/my-post/")
    })
  })

  describe("路径工具", () => {
    it("拼接/取目录/去扩展名对空值安全", () => {
      expect(joinRepoPath("", "/content/posts/", "a/b/")).toBe("content/posts/a/b")
      expect(dirnameRepoPath("content/posts/a/index.md")).toBe("content/posts/a")
      expect(stripMarkdownExtension("a.md")).toBe("a")
      expect(stripMarkdownExtension("a.markdown")).toBe("a")
      expect(stripMarkdownExtension(undefined)).toBe("")
    })
  })
})
