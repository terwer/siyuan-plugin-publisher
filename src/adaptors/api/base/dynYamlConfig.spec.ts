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
import dayjs from "dayjs"
import {
  applyDynYamlCfg,
  parseDynYamlCfg,
  resolveDynYamlCfg,
  validateDynYamlCfg,
} from "~/src/adaptors/api/base/dynYamlConfig.ts"

const buildPost = () => {
  const post = new Post()
  post.title = "占位符测试"
  post.wp_slug = "placeholder-test"
  post.dateCreated = new Date("2026-01-02T03:04:05.000Z")
  post.dateUpdated = new Date("2026-02-03T04:05:06.000Z")
  post.mt_keywords = "思源, 发布 "
  post.categories = ["技术", "笔记"]
  post.markdown = "# 正文"
  post.html = "<h1>正文</h1>"
  return post
}

describe("YAML 预设配置的解析与校验", () => {
  it("非法 JSON 解析为空对象，并给出可读的校验结果", () => {
    expect(parseDynYamlCfg("{not json")).toEqual({})
    expect(resolveDynYamlCfg("{not json", buildPost())).toEqual({})
    expect(validateDynYamlCfg("{not json")).toBe("invalidJson")
  })

  it("非对象配置解析为空对象，并给出可读的校验结果", () => {
    expect(resolveDynYamlCfg("[1, 2]", buildPost())).toEqual({})
    expect(validateDynYamlCfg("[1, 2]")).toBe("notObject")
    expect(validateDynYamlCfg("null")).toBe("notObject")
  })

  it("空配置与合法对象配置通过校验", () => {
    expect(validateDynYamlCfg(undefined)).toBeUndefined()
    expect(validateDynYamlCfg("")).toBeUndefined()
    expect(validateDynYamlCfg("  ")).toBeUndefined()
    expect(validateDynYamlCfg('{"draft": false}')).toBeUndefined()
  })

  it("静态取值保持原样", () => {
    const resolved = resolveDynYamlCfg('{"draft": false, "author": "terwer", "weight": 3}', buildPost())
    expect(resolved).toEqual({ draft: false, author: "terwer", weight: 3 })
  })
})

describe("YAML 预设配置的占位符", () => {
  it("整个值就是占位符时保留原生类型", () => {
    const post = buildPost()
    const resolved = resolveDynYamlCfg(
      '{"tags": "[tags]", "categories": "[categories]", "title": "[title]", "slug": "[slug]"}',
      post
    )
    expect(resolved.tags).toEqual(["思源", "发布"])
    expect(resolved.categories).toEqual(["技术", "笔记"])
    expect(resolved.title).toBe("占位符测试")
    expect(resolved.slug).toBe("placeholder-test")
  })

  it("时间占位符支持自定义格式，省略格式时使用 YYYY-MM-DD", () => {
    const post = buildPost()
    const resolved = resolveDynYamlCfg(
      '{"updatedDate": "[createDate-YYYY-MM-DD]", "time": "[updateDate-YYYY/MM/DD HH:mm]", "day": "[createDate]"}',
      post
    )
    expect(resolved.updatedDate).toBe(dayjs(post.dateCreated).format("YYYY-MM-DD"))
    expect(resolved.time).toBe(dayjs(post.dateUpdated).format("YYYY/MM/DD HH:mm"))
    expect(resolved.day).toBe(dayjs(post.dateCreated).format("YYYY-MM-DD"))
  })

  it("没有更新时间时，updateDate 使用创建时间", () => {
    const post = buildPost()
    post.dateUpdated = undefined
    const resolved = resolveDynYamlCfg('{"updatedDate": "[updateDate-YYYY-MM-DD]"}', post)
    expect(resolved.updatedDate).toBe(dayjs(post.dateCreated).format("YYYY-MM-DD"))
  })

  it("句子中的占位符按文本替换，未知占位符原样保留", () => {
    const post = buildPost()
    const resolved = resolveDynYamlCfg(
      '{"comment": "发布于 [createDate-YYYY-MM-DD]，标签 [tags]，[unknown] 保持原样"}',
      post
    )
    expect(resolved.comment).toBe(
      `发布于 ${dayjs(post.dateCreated).format("YYYY-MM-DD")}，标签 思源,发布，[unknown] 保持原样`
    )
  })

  it("嵌套对象与数组递归解析", () => {
    const post = buildPost()
    const resolved = resolveDynYamlCfg(
      '{"authors": [{"name": "[title]"}], "meta": {"date": "[createDate-YYYY-MM-DD]"}}',
      post
    )
    expect(resolved.authors).toEqual([{ name: "占位符测试" }])
    expect((resolved.meta as Record<string, unknown>).date).toBe(dayjs(post.dateCreated).format("YYYY-MM-DD"))
  })

  it("非字符串取值不参与替换", () => {
    const resolved = resolveDynYamlCfg('{"draft": false, "weight": 1, "empty": null}', buildPost())
    expect(resolved).toEqual({ draft: false, weight: 1, empty: null })
  })

  it("忽略原型污染键", () => {
    const post = buildPost()
    const resolved = resolveDynYamlCfg('{"__proto__": {"polluted": true}, "draft": false}', post)
    expect(Object.prototype).not.toHaveProperty("polluted")
    expect(Object.keys(resolved)).toEqual(["draft"])
    expect((resolved as any).polluted).toBeUndefined()
  })
})

describe("YAML 预设配置的合并", () => {
  it("预设配置为空时写入平台默认字段", () => {
    const yamlObj: Record<string, any> = {}
    applyDynYamlCfg(yamlObj, "", buildPost(), { enableToc: true, enableBackLinks: true })
    expect(yamlObj).toEqual({ enableToc: true, enableBackLinks: true })
  })

  it("预设配置非空时逐键覆盖，且不写入平台默认字段", () => {
    const yamlObj: Record<string, any> = { title: "原标题" }
    applyDynYamlCfg(yamlObj, '{"enableToc": false, "title": "[title]"}', buildPost(), {
      enableToc: true,
      enableBackLinks: true,
    })
    expect(yamlObj).toEqual({ title: "占位符测试", enableToc: false })
  })

  it("预设只包含缺失的文档属性时，不补平台默认字段", () => {
    const yamlObj: Record<string, any> = {}
    applyDynYamlCfg(yamlObj, '{"cover": "[attr:custom-missing]"}', buildPost(), {
      enableToc: true,
    })
    expect(yamlObj).toEqual({})
  })
})

describe("YAML 预设配置的文档属性占位符", () => {
  const withAttrs = (attrs: Record<string, unknown>) => {
    const post = buildPost()
    post.attrs = JSON.stringify(attrs)
    return post
  }

  it("整个取值是属性占位符时写入字符串", () => {
    const resolved = resolveDynYamlCfg(
      '{"cover": "[attr:custom-cover]", "memo": "[attr:memo]"}',
      withAttrs({ "custom-cover": "images/cover.png", memo: "文档摘要" })
    )
    expect(resolved.cover).toBe("images/cover.png")
    expect(resolved.memo).toBe("文档摘要")
  })

  it("属性名精确命中优先，兼容历史大写属性名", () => {
    const post = withAttrs({ "custom-cover": "lower.png", "custom-Cover": "upper.png", "custom-author": "作者" })
    const resolved = resolveDynYamlCfg(
      '{"exact": "[attr:custom-cover]", "legacy": "[attr:custom-Author]"}',
      post
    )
    expect(resolved.exact).toBe("lower.png")
    expect(resolved.legacy).toBe("作者")
  })

  it("嵌套对象与数组中的属性占位符递归解析", () => {
    const resolved = resolveDynYamlCfg(
      '{"params": {"cover": "[attr:custom-cover]"}, "authors": ["[attr:custom-author]"]}',
      withAttrs({ "custom-cover": "cover.png", "custom-author": "terwer" })
    )
    expect(resolved.params).toEqual({ cover: "cover.png" })
    expect(resolved.authors).toEqual(["terwer"])
  })

  it("属性不存在或为空时省略整个取值，数组项也会跳过", () => {
    const resolved = resolveDynYamlCfg(
      '{"cover": "[attr:custom-missing]", "empty": "[attr:custom-empty]", "nested": {"cover": "[attr:custom-missing]", "title": "[title]"}, "authors": ["[attr:custom-missing]", "[title]"]}',
      withAttrs({ "custom-empty": "" })
    )
    expect(resolved).toEqual({
      nested: { title: "占位符测试" },
      authors: ["占位符测试"],
    })
    expect("cover" in resolved).toBe(false)
    expect("empty" in resolved).toBe(false)
  })

  it("句子中的属性占位符按文本替换，缺失时写成空字符串", () => {
    const resolved = resolveDynYamlCfg(
      '{"comment": "封面 [attr:custom-cover]，作者 [attr:custom-author]"}',
      withAttrs({ "custom-cover": "cover.png" })
    )
    expect(resolved.comment).toBe("封面 cover.png，作者 ")
  })

  it("类型后缀 int/float/bool 转换原生类型", () => {
    const resolved = resolveDynYamlCfg(
      '{"weight": "[attr:custom-weight|int]", "score": "[attr:custom-score|float]", "draft": "[attr:custom-draft|bool]"}',
      withAttrs({ "custom-weight": "12", "custom-score": "3.5", "custom-draft": "true" })
    )
    expect(resolved).toEqual({ weight: 12, score: 3.5, draft: true })
  })

  it("类型转换失败时保留原字符串，未知类型按字符串处理", () => {
    const resolved = resolveDynYamlCfg(
      '{"badInt": "[attr:custom-bad|int]", "badFloat": "[attr:custom-bad|float]", "badBool": "[attr:custom-bad|bool]", "unknownType": "[attr:custom-ok|unknown]"}',
      withAttrs({ "custom-bad": "12px", "custom-ok": "保持" })
    )
    expect(resolved.badInt).toBe("12px")
    expect(resolved.badFloat).toBe("12px")
    expect(resolved.badBool).toBe("12px")
    expect(resolved.unknownType).toBe("保持")
  })

  it("Post.attrs 非法 JSON 时属性占位符视为缺失，不影响其他占位符", () => {
    const post = buildPost()
    post.attrs = "{not json"
    const resolved = resolveDynYamlCfg('{"cover": "[attr:custom-cover]", "title": "[title]"}', post)
    expect(resolved).toEqual({ title: "占位符测试" })
  })

  it("忽略属性占位符里的原型污染键", () => {
    const resolved = resolveDynYamlCfg(
      '{"proto": "[attr:__proto__]", "constructor": "[attr:constructor]", "safe": "[attr:custom-safe]"}',
      withAttrs({ "custom-safe": "ok" })
    )
    expect(resolved).toEqual({ safe: "ok" })
    expect(Object.prototype).not.toHaveProperty("polluted")
  })
})
