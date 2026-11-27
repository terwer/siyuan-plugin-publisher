/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { Post } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { WordpressConfig } from "~/src/adaptors/api/wordpress/wordpressConfig.ts"
import { WordpressApiAdaptor } from "~/src/adaptors/api/wordpress/wordpressApiAdaptor.ts"
import type { FeaturedImagePost } from "~/src/utils/featuredImage.ts"

const MEDIA_METHOD = "metaWeblog.newMediaObject"
const NEW_POST_METHOD = "metaWeblog.newPost"
const EDIT_POST_METHOD = "metaWeblog.editPost"
const GET_POST_METHOD = "metaWeblog.getPost"

/**
 * 构造一个把 XML-RPC 调用记录在内存里的适配器，避免单测依赖真实 WordPress 站点
 */
const createAdaptor = (mediaResult: any = { attachment_id: "42" }, getPostResult: any = { custom_fields: [] }) => {
  const cfg = new WordpressConfig("https://demo.example.com", "user", "password")
  const api = new WordpressApiAdaptor(new PublisherAppInstance(), cfg)

  const calls: Array<{ method: string; params: any[] }> = []
  const metaweblogCall = vi.fn(async (method: string, params: any[]) => {
    calls.push({ method, params })
    switch (method) {
      case MEDIA_METHOD:
        return mediaResult
      case NEW_POST_METHOD:
        return "101"
      case GET_POST_METHOD:
        return getPostResult
      default:
        return true
    }
  })
  ;(api as any).metaweblogCall = metaweblogCall

  const readFileToBase64 = vi.fn(async () => ({
    imageName: "cover.png",
    mimeType: "image/png",
    imageBase64: "R0lGODlhAQABAAAAACw=",
  }))
  const pushMsg = vi.fn(async () => undefined)
  ;(api as any).baseExtendApi.readFileToBase64 = readFileToBase64
  ;(api as any).baseExtendApi.pushMsg = pushMsg

  return { api, cfg, calls, metaweblogCall, readFileToBase64, pushMsg }
}

type CreatePostExtra = Partial<
  FeaturedImagePost & {
    custom_fields?: Array<{ id?: number | string; key: string; value: string }>
    customFieldsLoaded?: boolean
  }
>

const createPost = (extra: CreatePostExtra = {}): Post => {
  const post = new Post()
  post.title = "特色图片测试"
  post.description = "<p>正文</p>"
  post.wp_slug = "featured-image-test"
  return Object.assign(post, extra)
}

describe("test wordpressApiAdaptor featured image", () => {
  it("uploads the featured image and passes the attachment id with the new post", async () => {
    const { api, calls, readFileToBase64 } = createAdaptor()

    const postid = await api.newPost(createPost({ featuredImage: "assets/cover.png" }))

    expect(postid).toBe("101")
    expect(readFileToBase64).toHaveBeenCalledWith(`${window.location.origin}/assets/cover.png`)

    const mediaCall = calls.find((call) => call.method === MEDIA_METHOD)
    expect(mediaCall).toBeTruthy()
    expect(mediaCall!.params[3].name).toBe("cover.png")
    expect(mediaCall!.params[3].type).toBe("image/png")

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3].wp_post_thumbnail).toBe("42")
    expect(newPostCall!.params[3].title).toBe("特色图片测试")
  })

  it("keeps the post struct unchanged when no featured image is configured", async () => {
    const { api, calls, readFileToBase64 } = createAdaptor()

    await api.newPost(createPost())

    expect(readFileToBase64).not.toHaveBeenCalled()
    expect(calls.some((call) => call.method === MEDIA_METHOD)).toBe(false)
    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3]).not.toHaveProperty("wp_post_thumbnail")
  })

  it("does not send anything when the featured image was cleared on a new post", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost({ featuredImageCleared: true }))

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3]).not.toHaveProperty("wp_post_thumbnail")
  })

  it("clears the thumbnail of an existing post when the featured image was cleared", async () => {
    const { api, calls } = createAdaptor()

    await api.editPost("101", createPost({ featuredImageCleared: true }))

    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3].wp_post_thumbnail).toBe("")
    expect(calls.some((call) => call.method === MEDIA_METHOD)).toBe(false)
  })

  it("accepts an absolute image url as it is", async () => {
    const { api, readFileToBase64 } = createAdaptor()

    await api.newPost(createPost({ featuredImage: "https://img.example.com/cover.png?x=1" }))

    expect(readFileToBase64).toHaveBeenCalledWith("https://img.example.com/cover.png?x=1")
  })

  it("publishes the post body even when the featured image upload fails", async () => {
    const { api, calls, readFileToBase64, pushMsg } = createAdaptor()
    readFileToBase64.mockRejectedValueOnce(new Error("图片读取失败"))

    const post = createPost({ featuredImage: "assets/missing.png" })
    const postid = await api.newPost(post)

    expect(postid).toBe("101")
    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3]).not.toHaveProperty("wp_post_thumbnail")
    expect(calls.some((call) => call.method === MEDIA_METHOD)).toBe(false)
    expect((post as FeaturedImagePost).featuredImageError).toContain("图片读取失败")
    expect(pushMsg).toHaveBeenCalledTimes(1)
  })

  it("publishes the post body when the media library returns no attachment id", async () => {
    const { api, calls, pushMsg } = createAdaptor({ url: "https://demo.example.com/cover.png" })

    const post = createPost({ featuredImage: "assets/cover.png" })
    await api.newPost(post)

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3]).not.toHaveProperty("wp_post_thumbnail")
    expect((post as FeaturedImagePost).featuredImageError).toContain("媒体库未返回附件 ID")
    expect(pushMsg).toHaveBeenCalledTimes(1)
  })

  it("uses the deprecated id field when the media library only returns it", async () => {
    const { api, calls } = createAdaptor({ id: "77" })

    await api.newPost(createPost({ featuredImage: "assets/cover.png" }))

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3].wp_post_thumbnail).toBe("77")
  })
})

describe("test wordpressApiAdaptor source document id", () => {
  const SOURCE_ID = "20250127142705-8ia5fva"

  it("adds the siyuanid custom field when creating a post", async () => {
    const { api, calls } = createAdaptor()

    const post = createPost()
    post.originalId = SOURCE_ID
    await api.newPost(post)

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3].custom_fields).toEqual([{ key: "siyuanid", value: SOURCE_ID }])
  })

  it("does not add a fabricated siyuanid when the source document id is empty", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost())

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3]).not.toHaveProperty("custom_fields")
  })

  it("updates the existing siyuanid meta in place on edit", async () => {
    const existingCustomFields = [
      { id: 11, key: "other_field", value: "keep-me" },
      { id: 13, key: "siyuanid", value: "old-id" },
    ]
    const { api, calls } = createAdaptor(undefined, { custom_fields: existingCustomFields })

    const post = createPost()
    post.originalId = SOURCE_ID
    ;(post as any).custom_fields = existingCustomFields
    await api.editPost("101", post)

    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3].custom_fields).toEqual([{ id: 13, key: "siyuanid", value: SOURCE_ID }])
  })

  it("adds siyuanid once when the existing post has no such custom field", async () => {
    const existingCustomFields = [{ id: 11, key: "other_field", value: "keep-me" }]
    const { api, calls } = createAdaptor(undefined, { custom_fields: existingCustomFields })

    const post = createPost()
    post.originalId = SOURCE_ID
    ;(post as any).custom_fields = existingCustomFields
    await api.editPost("101", post)

    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3].custom_fields).toEqual([{ key: "siyuanid", value: SOURCE_ID }])
  })

  it("loads existing custom fields before an edit that did not carry them", async () => {
    const { api, calls } = createAdaptor(undefined, {
      custom_fields: [{ id: 7, key: "siyuanid", value: "old-id" }],
    })

    const post = createPost()
    post.originalId = SOURCE_ID
    await api.editPost("101", post)

    expect(calls.some((call) => call.method === GET_POST_METHOD)).toBe(true)
    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3].custom_fields).toEqual([{ id: 7, key: "siyuanid", value: SOURCE_ID }])
  })

  it("skips siyuanid instead of adding a duplicate when custom fields cannot be loaded", async () => {
    const { api, calls, metaweblogCall } = createAdaptor()
    metaweblogCall.mockRejectedValueOnce(new Error("读取失败"))

    const post = createPost()
    post.originalId = SOURCE_ID
    await api.editPost("101", post)

    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3]).not.toHaveProperty("custom_fields")
  })

  it("keeps the featured image and the source document id together", async () => {
    const { api, calls } = createAdaptor()

    const post = createPost({ featuredImage: "assets/cover.png" })
    post.originalId = SOURCE_ID
    await api.newPost(post)

    const newPostCall = calls.find((call) => call.method === NEW_POST_METHOD)
    expect(newPostCall!.params[3].wp_post_thumbnail).toBe("42")
    expect(newPostCall!.params[3].custom_fields).toEqual([{ key: "siyuanid", value: SOURCE_ID }])
  })

  it("updates every existing siyuanid row in place if duplicates already exist", async () => {
    const existingCustomFields = [
      { id: 21, key: "siyuanid", value: "old-a" },
      { id: 22, key: "siyuanid", value: "old-b" },
    ]
    const { api, calls } = createAdaptor(undefined, { custom_fields: existingCustomFields })

    const post = createPost()
    post.originalId = SOURCE_ID
    ;(post as any).custom_fields = existingCustomFields
    await api.editPost("101", post)

    const editPostCall = calls.find((call) => call.method === EDIT_POST_METHOD)
    expect(editPostCall!.params[3].custom_fields).toEqual([
      { id: 21, key: "siyuanid", value: SOURCE_ID },
      { id: 22, key: "siyuanid", value: SOURCE_ID },
    ])
  })
})
