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
import { Post, YamlFormatObj, YamlStrategy } from "zhi-blog-api"
import { usePublish } from "~/src/composables/usePublish.ts"
import { AuthMode, getDynCoverKey, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import type { IPublishCfg } from "~/src/types/IPublishCfg.ts"

const mockGetBlockAttrs = vi.hoisted(() => vi.fn())
const mockGetSingleBlockAttr = vi.hoisted(() => vi.fn())
const mockSetSingleBlockAttr = vi.hoisted(() => vi.fn())
const mockGetYamlAdaptor = vi.hoisted(() => vi.fn())

vi.mock("~/src/composables/useSiyuanApi.ts", () => ({
  useSiyuanApi: () => ({
    isStorageViaSiyuanApi: () => false,
    kernelApi: {
      getBlockAttrs: mockGetBlockAttrs,
      getSingleBlockAttr: mockGetSingleBlockAttr,
      setSingleBlockAttr: mockSetSingleBlockAttr,
    },
    blogApi: { getPost: vi.fn() },
  }),
}))

vi.mock("~/src/adaptors", () => ({
  default: {
    getYamlAdaptor: mockGetYamlAdaptor,
  },
}))

vi.mock("~/src/ui/composables/useAppI18n.ts", () => ({
  useAppI18n: () => ({ t: (key: string) => key }),
}))

vi.mock("element-plus", () => ({
  ElMessage: { success: vi.fn(), error: vi.fn() },
}))

const PLATFORM_KEY = "github_Hexo-t3st01"
const DOC_ID = "20260102000000-docid001"
const YAML_UPDATED = new Date("2026-01-01T00:00:00.000Z")
const DOC_UPDATED = new Date("2026-05-05T00:00:00.000Z")

const createPublishCfg = (): IPublishCfg => {
  const dynCfg = {
    platformType: PlatformType.Custom,
    subPlatformType: SubPlatformType.Github_Hexo,
    platformKey: PLATFORM_KEY,
    platformName: "Github Hexo",
    authMode: AuthMode.WEBSITE,
    isSys: false,
  } as DynamicConfig

  return {
    setting: {} as any,
    cfg: { posidKey: `custom-${PLATFORM_KEY}-post-id`, blogName: "hexo" } as any,
    dynCfg,
  } as IPublishCfg
}

const createFakeAdaptor = () => ({
  convertToYaml: vi.fn((post: Post) => {
    const yfm = new YamlFormatObj()
    yfm.yamlObj = { title: post.title, updated: YAML_UPDATED.toISOString() }
    yfm.formatter = "---\ntitle: generated\n---"
    yfm.mdContent = post.markdown
    yfm.mdFullContent = `${yfm.formatter}\n${post.markdown}`
    yfm.htmlContent = post.html
    return yfm
  }),
  convertToAttr: vi.fn((post: Post, yfm: YamlFormatObj) => {
    // 模拟真实适配器：用 YAML 里的 updated 覆盖模型的更新时间（这正是冻结更新时间的原因）
    post.dateUpdated = YAML_UPDATED
    post.yaml = yfm.formatter ?? "---\ntitle: stored\n---"
    return post
  }),
})

const createDoc = () => {
  const post = new Post()
  post.title = "标题"
  post.wp_slug = "slug"
  post.markdown = "# 标题"
  post.html = "<h1>标题</h1>"
  post.dateCreated = new Date("2026-01-01T00:00:00.000Z")
  post.dateUpdated = DOC_UPDATED
  return post
}

describe("usePublish.assignInitAttrs", () => {
  let adaptor: ReturnType<typeof createFakeAdaptor>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    adaptor = createFakeAdaptor()
    mockGetYamlAdaptor.mockResolvedValue(adaptor)
    mockGetSingleBlockAttr.mockResolvedValue("")
  })

  it("按小写属性名读到已保存的 YAML，不会重新生成默认值", async () => {
    mockGetBlockAttrs.mockResolvedValue({ [`custom-github-hexo-t3st01-yaml`]: "---\ntitle: stored\n---" })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(adaptor.convertToAttr).toHaveBeenCalledTimes(1)
    expect(adaptor.convertToYaml).not.toHaveBeenCalled()
    expect(post.yamlType).toBe(YamlStrategy.Yaml_custom_hand)
  })

  it("兼容历史上含大写字母的属性名", async () => {
    mockGetBlockAttrs.mockResolvedValue({ [`custom-github-Hexo-t3st01-yaml`]: "---\ntitle: legacy\n---" })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(adaptor.convertToAttr).toHaveBeenCalledTimes(1)
    expect(post.yamlType).toBe(YamlStrategy.Yaml_custom_hand)
  })

  it("没有保存过 YAML 时按适配器生成默认值", async () => {
    mockGetBlockAttrs.mockResolvedValue({})

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(adaptor.convertToYaml).toHaveBeenCalledTimes(1)
    expect(post.yamlType).toBe(YamlStrategy.Yaml_custom_auto)
  })

  it("读取块属性异常时回退到单属性查询", async () => {
    mockGetBlockAttrs.mockRejectedValue(new Error("kernel busy"))
    mockGetSingleBlockAttr.mockResolvedValue("---\ntitle: fallback\n---")

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(mockGetSingleBlockAttr).toHaveBeenCalledWith(DOC_ID, "custom-github-hexo-t3st01-yaml")
    expect(post.yamlType).toBe(YamlStrategy.Yaml_custom_hand)
  })

  it("把不同 YAML 适配器写在不同字段的摘要/标签归一化", async () => {
    const adaptor2 = {
      convertToYaml: vi.fn(),
      convertToAttr: vi.fn((post: Post) => {
        post.mt_excerpt = "平台摘要"
        post.mt_keywords = ["标签甲", "标签乙"] as unknown as string
        return post
      }),
    }
    mockGetYamlAdaptor.mockResolvedValue(adaptor2)
    mockGetBlockAttrs.mockResolvedValue({
      [`custom-github-hexo-t3st01-yaml`]: "---\ndescription: 平台摘要\n---",
    })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(post.shortDesc).toBe("平台摘要")
    expect(post.mt_excerpt).toBe("平台摘要")
    expect(post.mt_keywords).toBe("标签甲,标签乙")
  })

  it("更新时间不退回 YAML 里的旧值（文档时间更晚时以文档为准）", async () => {
    mockGetBlockAttrs.mockResolvedValue({ [`custom-github-hexo-t3st01-yaml`]: "---\ntitle: stored\n---" })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, createPublishCfg())

    expect(post.dateUpdated?.getTime()).toBe(DOC_UPDATED.getTime())
  })

  it("把完整文档属性合并进 Post.attrs，供 YAML 预设读取", async () => {
    mockGetBlockAttrs.mockResolvedValue({
      "custom-cover": "cover.png",
      "custom-publish-status": "publish",
      [`custom-github-hexo-t3st01-yaml`]: "---\ntitle: stored\n---",
    })
    const doc = createDoc()
    doc.attrs = JSON.stringify({ "custom-publish-status": "draft", "custom-publish-time": "2026-01-01" })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(doc, DOC_ID, createPublishCfg())

    expect(JSON.parse(post.attrs ?? "{}")).toMatchObject({
      "custom-cover": "cover.png",
      "custom-publish-status": "draft",
      "custom-publish-time": "2026-01-01",
    })
  })

  it("读取文档属性异常时保留已有 Post.attrs，并回退到单属性查询", async () => {
    mockGetBlockAttrs.mockRejectedValue(new Error("kernel busy"))
    mockGetSingleBlockAttr.mockResolvedValue("---\ntitle: fallback\n---")
    const doc = createDoc()
    doc.attrs = JSON.stringify({ "custom-publish-status": "publish" })

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(doc, DOC_ID, createPublishCfg())

    expect(post.attrs).toBe(doc.attrs)
    expect(post.yamlType).toBe(YamlStrategy.Yaml_custom_hand)
    expect(mockGetBlockAttrs).toHaveBeenCalledTimes(1)
  })

  it("静态站封面从平台元数据回填，更新时能继续使用", async () => {
    mockGetBlockAttrs.mockResolvedValue({})
    const publishCfg = createPublishCfg()
    ;(publishCfg.cfg as any).yamlCoverEnabled = true
    ;(publishCfg.cfg as any).featuredImageEnabled = true
    ;(publishCfg.setting as any)[DOC_ID] = {
      [getDynCoverKey(PLATFORM_KEY)]: "assets/cover.png",
    }

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, publishCfg)

    expect((post as any).featuredImage).toBe("assets/cover.png")
  })

  it("静态站未设置封面时保持空值，不用题头图/正文首图自动补", async () => {
    mockGetBlockAttrs.mockResolvedValue({})
    const publishCfg = createPublishCfg()
    ;(publishCfg.cfg as any).yamlCoverEnabled = true
    ;(publishCfg.cfg as any).featuredImageEnabled = true

    const { initPublishMethods } = usePublish()
    const post = await initPublishMethods.assignInitAttrs(createDoc(), DOC_ID, publishCfg)

    expect((post as any).featuredImage).toBeUndefined()
  })
})
