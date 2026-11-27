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
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"
import { getLocalDateParts } from "~/src/utils/dateUtils.ts"
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
    sql: vi.fn(async () => []),
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
    usePreferenceSettingStore().getPublishPreferenceSetting().value.removeMdWidgetTag = false
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

  it("静态站封面：思源资源上传后写入平台地址", async () => {
    const { extendApi, api, cfg, publishCfg } = createExtendApi({})
    ;(cfg as any).coverEnabled = false
    ;(cfg as any).yamlCoverEnabled = true
    api.newMediaObject.mockResolvedValue({ url: "../images/cover.png" })
    ;(extendApi as any).readFileToBase64 = vi.fn(async () => ({
      imageName: "cover.png",
      mimeType: "image/png",
      imageBase64: "AAAA",
    }))
    const post = createPost("# 正文") as FeaturedImagePost
    post.featuredImage = "assets/cover.png"
    post.featuredImageTouched = true

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBe("../images/cover.png")
    expect(result.coverSource).toBe(CoverSource.Custom)
    expect(api.newMediaObject).toHaveBeenCalledTimes(1)
  })

  it("静态站封面：远程地址与站内路径直接使用，不重复上传", async () => {
    const { extendApi, api, cfg, publishCfg } = createExtendApi({})
    ;(cfg as any).coverEnabled = false
    ;(cfg as any).yamlCoverEnabled = true

    const remotePost = createPost("# 正文") as FeaturedImagePost
    remotePost.featuredImage = "https://img.example.com/cover.png"
    remotePost.featuredImageTouched = true
    const remoteResult = await extendApi.preEditPost(remotePost, "doc-1", publishCfg)

    expect(remoteResult.cover).toBe("https://img.example.com/cover.png")
    expect(api.newMediaObject).not.toHaveBeenCalled()

    const pathPost = createPost("# 正文") as FeaturedImagePost
    pathPost.featuredImage = "../images/cover.png"
    pathPost.featuredImageTouched = true
    const pathResult = await extendApi.preEditPost(pathPost, "doc-1", publishCfg)

    expect(pathResult.cover).toBe("../images/cover.png")
    expect(api.newMediaObject).not.toHaveBeenCalled()
  })

  it("静态站封面：用户清空后不写封面", async () => {
    const { extendApi, api, cfg, publishCfg } = createExtendApi({})
    ;(cfg as any).coverEnabled = false
    ;(cfg as any).yamlCoverEnabled = true
    const post = createPost("# 正文") as FeaturedImagePost
    post.featuredImage = ""
    post.featuredImageTouched = true

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.cover).toBeUndefined()
    expect(api.newMediaObject).not.toHaveBeenCalled()
  })

  it("静态站封面：上传失败只记录提示，不阻断正文", async () => {
    const { extendApi, api, cfg, publishCfg } = createExtendApi({})
    ;(cfg as any).coverEnabled = false
    ;(cfg as any).yamlCoverEnabled = true
    api.newMediaObject.mockRejectedValue(new Error("upload failed"))
    ;(extendApi as any).readFileToBase64 = vi.fn(async () => ({
      imageName: "cover.png",
      mimeType: "image/png",
      imageBase64: "AAAA",
    }))
    const post = createPost("# 正文") as FeaturedImagePost
    post.featuredImage = "assets/cover.png"
    post.featuredImageTouched = true

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.markdown).toContain("# 正文")
    expect((result as FeaturedImagePost).featuredImageError).toContain("封面图设置失败")
  })

  it("开启去除挂件HTML时清理第三方插件写入的 HTML 块", async () => {
    const { extendApi, publishCfg, kernelApi } = createExtendApi({})
    const card = [
      "<div>",
      '  <style>.kg-card { color: red; }</style>',
      '  <main class="kg-card-main">Example card</main>',
      "</div>",
    ].join("\n")
    kernelApi.sql.mockResolvedValue([{ content: card }])
    usePreferenceSettingStore().getPublishPreferenceSetting().value.removeMdWidgetTag = true
    const post = createPost(["# 标题", "", "前面", "", card, "", "后面"].join("\n"))

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.markdown).not.toContain("kg-card")
    expect(result.markdown).not.toContain("<style>")
    expect(result.markdown).toContain("前面")
    expect(result.markdown).toContain("后面")
    expect(kernelApi.sql).toHaveBeenCalledTimes(1)
  })

  it("关闭去除挂件HTML时保留 HTML 块", async () => {
    const { extendApi, publishCfg, kernelApi } = createExtendApi({})
    const card = "<div>Example card</div>"
    kernelApi.sql.mockResolvedValue([{ content: card }])
    const post = createPost(["前面", "", card, "", "后面"].join("\n"))

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    expect(result.markdown).toContain(card)
    expect(kernelApi.sql).not.toHaveBeenCalled()
  })

  it("文件名日期占位符使用作者本地日期，而不是固定 +8", async () => {
    const { extendApi, cfg, publishCfg } = createExtendApi({})
    cfg.mdFilenameRule = "[yyyy]-[mm]-[dd]-[slug].md"
    const post = createPost("# 正文")
    post.wp_slug = "local-date"
    // UTC 18:30；东八区已是次日，西欧/美洲仍是当天
    post.dateCreated = new Date("2026-11-18T18:30:00.000Z")

    const result = await extendApi.preEditPost(post, "doc-1", publishCfg)

    const { yyyy, MM, dd } = getLocalDateParts(post.dateCreated)
    expect(result.mdFilename).toBe(`${yyyy}-${MM}-${dd}-local-date.md`)
  })
})
