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
import { YamlUtil } from "zhi-common"
import {
  extractFirstImageOfPost,
  FEATURED_IMAGE_YAML_KEY,
  getFeaturedImage,
  initFeaturedImageFromYaml,
  isFeaturedImageEnabled,
  readFeaturedImageFromYaml,
  syncFeaturedImageYaml,
  uploadFeaturedImageAsset,
  writeFeaturedImageToYaml,
  type FeaturedImageAssetKernel,
  type FeaturedImagePost,
} from "~/src/utils/featuredImage.ts"

const yamlWithFeature = (url: string, extra: Record<string, any> = {}) =>
  YamlUtil.obj2Yaml({ ...extra, [FEATURED_IMAGE_YAML_KEY]: url })

describe("featuredImage util", () => {
  it("reads a saved featured image from the platform yaml attr", () => {
    expect(readFeaturedImageFromYaml(yamlWithFeature("assets/cover.png"))).toBe("assets/cover.png")
    expect(readFeaturedImageFromYaml(yamlWithFeature(" https://img.example.com/a.png "))).toBe(
      "https://img.example.com/a.png"
    )
  })

  it("returns an empty string when there is no featured image", () => {
    expect(readFeaturedImageFromYaml("")).toBe("")
    expect(readFeaturedImageFromYaml(undefined)).toBe("")
    expect(readFeaturedImageFromYaml(YamlUtil.obj2Yaml({ title: "无特色图片" }))).toBe("")
    expect(readFeaturedImageFromYaml("not a yaml at all")).toBe("")
  })

  it("writes the featured image while keeping other yaml fields", () => {
    const yaml = writeFeaturedImageToYaml(YamlUtil.obj2Yaml({ abbrlink: "abc" }), "assets/cover.png")
    const yamlObj = YamlUtil.yaml2Obj(yaml)

    expect(yamlObj.abbrlink).toBe("abc")
    expect(yamlObj[FEATURED_IMAGE_YAML_KEY]).toBe("assets/cover.png")
  })

  it("creates the yaml attr when none was saved yet", () => {
    const yaml = writeFeaturedImageToYaml("", "https://img.example.com/a.png")

    expect(readFeaturedImageFromYaml(yaml)).toBe("https://img.example.com/a.png")
  })

  it("removes the key when the featured image is cleared", () => {
    const yaml = writeFeaturedImageToYaml(yamlWithFeature("assets/cover.png", { abbrlink: "abc" }), "")

    expect(readFeaturedImageFromYaml(yaml)).toBe("")
    expect(YamlUtil.yaml2Obj(yaml).abbrlink).toBe("abc")
  })

  it("keeps the yaml untouched when clearing a key that was never saved", () => {
    const source = YamlUtil.obj2Yaml({ abbrlink: "abc" })

    expect(writeFeaturedImageToYaml(source, "")).toBe(source)
    expect(writeFeaturedImageToYaml("", "")).toBe("")
  })

  it("keeps the original yaml when it cannot be parsed", () => {
    const broken = "---\n\tbad: [unclosed\n---"

    expect(writeFeaturedImageToYaml(broken, "assets/cover.png")).toBe(broken)
  })

  it("marks a cleared featured image for the adapter", () => {
    const post = new Post() as FeaturedImagePost
    post.yaml = yamlWithFeature("assets/cover.png")
    post.featuredImage = ""

    syncFeaturedImageYaml(post)

    expect(post.featuredImageCleared).toBe(true)
    expect(readFeaturedImageFromYaml(post.yaml)).toBe("")
  })

  it("marks a newly set featured image without the clear flag", () => {
    const post = new Post() as FeaturedImagePost
    post.featuredImage = "assets/cover.png"

    syncFeaturedImageYaml(post)

    expect(post.featuredImageCleared).toBe(false)
    expect(readFeaturedImageFromYaml(post.yaml)).toBe("assets/cover.png")
  })

  it("does not touch the yaml when the platform did not configure a featured image", () => {
    const post = new Post() as FeaturedImagePost
    post.yaml = YamlUtil.obj2Yaml({ abbrlink: "abc" })

    syncFeaturedImageYaml(post)

    expect(post.yaml).toBe(YamlUtil.obj2Yaml({ abbrlink: "abc" }))
    expect(post.featuredImageCleared).toBe(false)
  })

  it("adopts a featured image written in source mode without rewriting the yaml", () => {
    const post = new Post() as FeaturedImagePost
    const source = yamlWithFeature("assets/source.png")
    post.yaml = source

    syncFeaturedImageYaml(post)

    expect(getFeaturedImage(post)).toBe("assets/source.png")
    expect(post.featuredImageCleared).toBe(false)
    expect(post.yaml).toBe(source)
  })

  it("fills the featured image from the saved yaml attr", () => {
    const post = new Post() as FeaturedImagePost
    post.yaml = yamlWithFeature("assets/cover.png")

    initFeaturedImageFromYaml(post)

    expect(getFeaturedImage(post)).toBe("assets/cover.png")
  })

  it("does not overwrite a featured image that is already set", () => {
    const post = new Post() as FeaturedImagePost
    post.yaml = yamlWithFeature("assets/saved.png")
    post.featuredImage = "assets/typed.png"

    initFeaturedImageFromYaml(post)

    expect(getFeaturedImage(post)).toBe("assets/typed.png")
  })

  it("recognises the capability flag on a platform config", () => {
    expect(isFeaturedImageEnabled(undefined)).toBe(false)
    expect(isFeaturedImageEnabled({} as any)).toBe(false)
    expect(isFeaturedImageEnabled({ featuredImageEnabled: true } as any)).toBe(true)
  })

  it("takes the first image of the post body", () => {
    const fromHtml = new Post()
    fromHtml.html = '<p>text</p><img src="assets/first.png" alt="a" /><img src="assets/second.png" />'
    expect(extractFirstImageOfPost(fromHtml)).toBe("assets/first.png")

    const fromMd = new Post()
    fromMd.markdown = "text\n\n![a](assets/md-first.png)\n\n![b](assets/md-second.png)"
    expect(extractFirstImageOfPost(fromMd)).toBe("assets/md-first.png")

    const empty = new Post()
    empty.html = "<p>no image</p>"
    empty.markdown = "no image"
    expect(extractFirstImageOfPost(empty)).toBe("")
    expect(extractFirstImageOfPost(undefined)).toBe("")
  })
})

describe("featuredImage upload", () => {
  const createFile = () => new File(["x"], "cover.png", { type: "image/png" })

  it("uploads the picked file to the siyuan assets dir and returns its path", async () => {
    const formDataSpy: FormData[] = []
    const kernel: FeaturedImageAssetKernel = {
      uploadAsset: (formData) => {
        formDataSpy.push(formData)
        return Promise.resolve({ errFiles: [], succMap: { "cover.png": "assets/cover-20261115.png" } })
      },
    }

    const path = await uploadFeaturedImageAsset(kernel, createFile())

    expect(path).toBe("assets/cover-20261115.png")
    expect(formDataSpy).toHaveLength(1)
    expect(formDataSpy[0].get("assetsDirPath")).toBe("/assets/")
    expect(formDataSpy[0].get("file[]")).toBeInstanceOf(File)
  })

  it("reports a failure when the kernel returns no uploaded path", async () => {
    const kernel: FeaturedImageAssetKernel = {
      uploadAsset: () => Promise.resolve({ errFiles: ["cover.png"], succMap: {} }),
    }

    await expect(uploadFeaturedImageAsset(kernel, createFile())).rejects.toThrow("cover.png")
  })

  it("reports a failure when the kernel returns nothing at all", async () => {
    const kernel: FeaturedImageAssetKernel = { uploadAsset: () => Promise.resolve(undefined) }

    await expect(uploadFeaturedImageAsset(kernel, createFile())).rejects.toThrow("图片上传失败")
  })

  it("rejects when no file was picked", async () => {
    const kernel: FeaturedImageAssetKernel = { uploadAsset: () => Promise.resolve({ succMap: {} }) }

    await expect(uploadFeaturedImageAsset(kernel, undefined as unknown as File)).rejects.toThrow("请选择要上传的图片")
  })
})
