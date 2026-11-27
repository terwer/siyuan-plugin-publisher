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
import { HexoYamlConverterAdaptor } from "~/src/adaptors/api/hexo/hexoYamlConverterAdaptor.ts"

const createPost = (cover?: string) => {
  const post = new Post()
  post.title = "封面测试"
  post.wp_slug = "cover-test"
  post.markdown = "正文"
  post.dateCreated = new Date("2026-11-27T00:00:00Z")
  post.dateUpdated = new Date("2026-11-27T00:00:00Z")
  if (cover !== undefined) {
    post.cover = cover
  }
  return post
}

const createCfg = (extra: Record<string, any> = {}) =>
  ({
    yamlLinkEnabled: false,
    yamlCoverEnabled: true,
    ...extra,
  }) as any

describe("HexoYamlConverterAdaptor 封面", () => {
  it("启用 Front Matter 封面时默认写入 cover", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(
      createPost("../images/cover.png"),
      undefined,
      createCfg()
    )

    expect(result.yamlObj.cover).toBe("../images/cover.png")
  })

  it("没有封面时不写 cover 字段", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(createPost(), undefined, createCfg())

    expect(result.yamlObj).not.toHaveProperty("cover")
  })

  it("未声明 Front Matter 封面能力时不写 cover", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(
      createPost("../images/cover.png"),
      undefined,
      createCfg({ yamlCoverEnabled: false })
    )

    expect(result.yamlObj).not.toHaveProperty("cover")
  })

  it("YAML 预设用 [cover] 映射主题字段时不重复写默认 cover", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(
      createPost("../images/cover.png"),
      undefined,
      createCfg({ dynYamlCfg: '{"index_img":"[cover]","banner_img":"[cover]"}' })
    )

    expect(result.yamlObj.index_img).toBe("../images/cover.png")
    expect(result.yamlObj.banner_img).toBe("../images/cover.png")
    expect(result.yamlObj).not.toHaveProperty("cover")
  })

  it("支持通过平台配置改封面字段名", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(
      createPost("../images/cover.png"),
      undefined,
      createCfg({ yamlCoverKey: "top_img" })
    )

    expect(result.yamlObj.top_img).toBe("../images/cover.png")
    expect(result.yamlObj).not.toHaveProperty("cover")
  })

  it("YAML 预设显式写同名字段时保持预设优先", () => {
    const result = new HexoYamlConverterAdaptor().convertToYaml(
      createPost("../images/cover.png"),
      undefined,
      createCfg({ dynYamlCfg: '{"cover":"manual.png"}' })
    )

    expect(result.yamlObj.cover).toBe("manual.png")
  })
})
