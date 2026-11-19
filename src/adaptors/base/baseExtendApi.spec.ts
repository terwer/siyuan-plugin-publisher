/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { CoverSource, PageTypeEnum, PicbedServiceTypeEnum, Post } from "zhi-blog-api"
import { BaseExtendApi } from "~/src/adaptors/base/baseExtendApi.ts"
import { getMediaCacheContext } from "~/src/utils/mediaCacheContext.ts"
import type { FeaturedImagePost } from "~/src/utils/featuredImage.ts"

vi.mock("~/src/utils/luteUtil.ts", () => ({
  LuteUtil: {
    mdToHtml: vi.fn(() => "<p>html</p>"),
  },
}))

const createExtendApi = (attrs: Record<string, any> = {}) => {
  const api = {
    getYamlAdaptor: () => null,
    newMediaObject: vi.fn(),
  }
  const cfg = {
    posidKey: "custom-common_Halo-post-id",
    picbedService: PicbedServiceTypeEnum.None,
    pageType: PageTypeEnum.Markdown,
    mdFilenameRule: "",
    coverEnabled: true,
  }
  const extendApi = new BaseExtendApi(api as any, cfg as any)
  const kernelApi = {
    getBlockAttrs: vi.fn(async () => ({ ...attrs })),
    getBlockByID: vi.fn(async () => ({ box: "box-1", path: "/demo.sy" })),
    setSingleBlockAttr: vi.fn(),
    resolveDocTitleImageUrl: (path?: string) => `http://siyuan/${(path ?? "").replace(/^\.?\//, "")}`,
  }
  ;(extendApi as any).kernelApi = kernelApi
  const publishCfg = {
    cfg,
    dynCfg: { platformKey: "common_Halo" },
  }
  return { extendApi, api, cfg, kernelApi, publishCfg }
}

const createPost = (markdown: string) => {
  const post = new Post()
  post.title = "封面测试"
  post.wp_slug = "cover-test"
  post.link = "/demo"
  post.dateCreated = new Date("2026-11-18T00:00:00Z")
  post.yaml = ""
  post.markdown = markdown
  return post
}

describe("BaseExtendApi 通用封面解析", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it("优先使用题头图链接，并从正文开头剔除题头图", async () => {
    const { extendApi, publishCfg } = createExtendApi({
      "title-img": 'background-image:url("assets/cover.png")',
    })
    const post = createPost(
      ["---", "title: 封面测试", "---", "", "![image](assets/cover.png)", "", "# 正文标题", "", "正文内容"].join("\n")
    )

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBe("http://siyuan/assets/cover.png")
    expect(result.coverSource).toBe(CoverSource.TitleImage)
    expect(result.markdown).not.toContain("![image](assets/cover.png)")
    expect(result.markdown).toContain("# 正文标题")
    expect(getMediaCacheContext(result)).toMatchObject({
      docId: "doc-1",
      platformKey: "common_Halo",
    })
  })

  it("用户主动选择的封面优先于题头图", async () => {
    const { extendApi, publishCfg } = createExtendApi({
      "title-img": 'background-image:url("assets/cover.png")',
    })
    const post = createPost("![image](assets/cover.png)\n\n# 正文") as FeaturedImagePost
    post.featuredImage = "assets/chosen.png"
    post.featuredImageTouched = true

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBe("http://siyuan/assets/chosen.png")
    expect(result.coverSource).toBe(CoverSource.Custom)
    expect(result.markdown).not.toContain("![image](assets/cover.png)")
  })

  it("没有题头图时回退到正文首图链接", async () => {
    const { extendApi, publishCfg } = createExtendApi({})
    const post = createPost("# 正文\n\n![body](assets/body.png)\n\n后续内容")

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBe("http://siyuan/assets/body.png")
    expect(result.coverSource).toBe(CoverSource.FirstBodyImage)
  })

  it("平台不支持封面时保持正文不变", async () => {
    const { extendApi, cfg, publishCfg } = createExtendApi({
      "title-img": 'background-image:url("assets/cover.png")',
    })
    ;(cfg as any).coverEnabled = false
    const post = createPost("![image](assets/cover.png)\n\n# 正文")

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBeUndefined()
    expect(result.markdown).toContain("![image](assets/cover.png)")
  })
})
