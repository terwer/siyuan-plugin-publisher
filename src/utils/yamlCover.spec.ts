/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { YamlUtil } from "zhi-common"
import {
  DEFAULT_YAML_COVER_KEY,
  getYamlCoverKey,
  hasCoverPlaceholder,
  isPlatformCoverPath,
  isRemoteCoverUrl,
  isSiyuanAssetCover,
  isYamlCoverEnabled,
  needsCoverUpload,
  removeYamlCoverKey,
} from "~/src/utils/yamlCover.ts"

const asCfg = (cfg: Record<string, any>) => cfg as any

describe("yamlCover util", () => {
  it("只有在显式声明能力时才启用 Front Matter 封面", () => {
    expect(isYamlCoverEnabled(undefined)).toBe(false)
    expect(isYamlCoverEnabled(asCfg({}))).toBe(false)
    expect(isYamlCoverEnabled(asCfg({ yamlCoverEnabled: false }))).toBe(false)
    expect(isYamlCoverEnabled(asCfg({ yamlCoverEnabled: true }))).toBe(true)
  })

  it("默认封面字段名是 cover，可通过配置覆盖", () => {
    expect(getYamlCoverKey(undefined)).toBe(DEFAULT_YAML_COVER_KEY)
    expect(getYamlCoverKey(asCfg({}))).toBe("cover")
    expect(getYamlCoverKey(asCfg({ yamlCoverKey: "index_img" }))).toBe("index_img")
    expect(getYamlCoverKey(asCfg({ yamlCoverKey: "  " }))).toBe("cover")
  })

  it("识别 YAML 预设里的 [cover] 占位符", () => {
    expect(hasCoverPlaceholder(undefined)).toBe(false)
    expect(hasCoverPlaceholder("{}")).toBe(false)
    expect(hasCoverPlaceholder('{"cover":"[cover]"}')).toBe(true)
    expect(hasCoverPlaceholder('{"index_img":"[cover]"}')).toBe(true)
  })

  it("移除已保存的封面字段并保留其它字段", () => {
    const yaml = YamlUtil.obj2Yaml({ title: "标题", cover: "../images/a.png", toc: true })
    const updated = removeYamlCoverKey(yaml, "cover")
    const obj = YamlUtil.yaml2Obj(updated) as Record<string, any>

    expect(obj.cover).toBeUndefined()
    expect(obj.title).toBe("标题")
    expect(obj.toc).toBe(true)
  })

  it("没有封面字段时保持原样", () => {
    const yaml = YamlUtil.obj2Yaml({ title: "标题" })

    expect(removeYamlCoverKey(yaml, "cover")).toBe(yaml)
    expect(removeYamlCoverKey("", "cover")).toBe("")
  })

  it("YAML 解析失败时不做破坏性改写", () => {
    const broken = "---\n\tbad: [unclosed\n---"

    expect(removeYamlCoverKey(broken, "cover")).toBe(broken)
  })

  it("区分远程地址、站内路径与思源资源", () => {
    expect(isRemoteCoverUrl("https://img.example.com/a.png")).toBe(true)
    expect(isRemoteCoverUrl("//cdn.example.com/a.png")).toBe(true)
    expect(isRemoteCoverUrl("data:image/png;base64,AAAA")).toBe(true)
    expect(isRemoteCoverUrl("assets/a.png")).toBe(false)

    expect(isSiyuanAssetCover("assets/a.png")).toBe(true)
    expect(isSiyuanAssetCover("/assets/a.png")).toBe(true)
    expect(isSiyuanAssetCover("../assets/a.png")).toBe(true)
    expect(isSiyuanAssetCover("siyuan://blocks/1")).toBe(true)
    expect(isSiyuanAssetCover("../images/a.png")).toBe(false)

    expect(isPlatformCoverPath("../images/a.png")).toBe(true)
    expect(isPlatformCoverPath("./images/a.png")).toBe(true)
    expect(isPlatformCoverPath("/images/a.png")).toBe(true)
    expect(isPlatformCoverPath("https://img.example.com/a.png")).toBe(false)
    expect(isPlatformCoverPath("assets/a.png")).toBe(false)
  })

  it("只对需要上传的地址执行上传", () => {
    expect(needsCoverUpload("https://img.example.com/a.png")).toBe(false)
    expect(needsCoverUpload("../images/a.png")).toBe(false)
    expect(needsCoverUpload("/images/a.png")).toBe(false)
    expect(needsCoverUpload("assets/a.png")).toBe(true)
    expect(needsCoverUpload("a.png")).toBe(true)
  })
})
