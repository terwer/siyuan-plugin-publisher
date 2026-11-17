/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { Post, PostStatusEnum } from "zhi-blog-api"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { MetaweblogConfig } from "~/src/adaptors/api/base/metaweblog/metaweblogConfig.ts"
import { MetaweblogBlogApiAdaptor } from "~/src/adaptors/api/base/metaweblog/metaweblogBlogApiAdaptor.ts"
import { MetaweblogConstants } from "~/src/adaptors/api/base/metaweblog/metaweblogConstants.ts"

const NEW_POST_METHOD = MetaweblogConstants.METHOD_NEW_POST
const EDIT_POST_METHOD = MetaweblogConstants.METHOD_EDIT_POST

/**
 * 构造一个把 XML-RPC 调用记录在内存里的适配器，避免单测依赖真实博客站点
 */
const createAdaptor = () => {
  const cfg = new MetaweblogConfig(
    "https://demo.example.com",
    "https://demo.example.com/xmlrpc",
    "user",
    "password",
  )
  const api = new MetaweblogBlogApiAdaptor(new PublisherAppInstance(), cfg)

  const calls: Array<{ method: string; params: any[] }> = []
  const metaweblogCall = vi.fn(async (method: string, params: any[]) => {
    calls.push({ method, params })
    return method === NEW_POST_METHOD ? "101" : true
  })
  ;(api as any).metaweblogCall = metaweblogCall

  return { api, calls }
}

const createPost = (postStatus?: PostStatusEnum): Post => {
  const post = new Post()
  post.title = "发布状态测试"
  post.description = "<p>正文</p>"
  if (postStatus) {
    post.post_status = postStatus
  }
  return post
}

const readNewPostCall = (calls: Array<{ method: string; params: any[] }>) => {
  const call = calls.find((item) => item.method === NEW_POST_METHOD)
  expect(call).toBeTruthy()
  return { postStruct: call!.params[3], publish: call!.params[4] }
}

describe("test metaweblogBlogApiAdaptor publish flag", () => {
  it("publishes when the post status is publish", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost(PostStatusEnum.PostStatusEnum_Publish))

    const { postStruct, publish } = readNewPostCall(calls)
    expect(publish).toBe(true)
    expect(postStruct.post_status).toBe(PostStatusEnum.PostStatusEnum_Publish)
  })

  it("keeps a draft as a draft", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost(PostStatusEnum.PostStatusEnum_Draft))

    const { postStruct, publish } = readNewPostCall(calls)
    expect(publish).toBe(false)
    expect(postStruct.post_status).toBe(PostStatusEnum.PostStatusEnum_Draft)
  })

  it("keeps a private post private while still publishing it", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost(PostStatusEnum.PostStatusEnum_Private))

    const { postStruct, publish } = readNewPostCall(calls)
    expect(publish).toBe(true)
    expect(postStruct.post_status).toBe(PostStatusEnum.PostStatusEnum_Private)
  })

  it("fills an empty status with publish", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost())

    const { postStruct, publish } = readNewPostCall(calls)
    expect(publish).toBe(true)
    expect(postStruct.post_status).toBe(PostStatusEnum.PostStatusEnum_Publish)
  })

  it("honours an explicit publish flag over the post status", async () => {
    const { api, calls } = createAdaptor()

    await api.newPost(createPost(PostStatusEnum.PostStatusEnum_Publish), false)

    const { postStruct, publish } = readNewPostCall(calls)
    expect(publish).toBe(false)
    expect(postStruct.post_status).toBe(PostStatusEnum.PostStatusEnum_Draft)
  })

  it("keeps a draft when editing an existing post", async () => {
    const { api, calls } = createAdaptor()

    await api.editPost("101", createPost(PostStatusEnum.PostStatusEnum_Draft))

    const call = calls.find((item) => item.method === EDIT_POST_METHOD)
    expect(call).toBeTruthy()
    expect(call!.params[3].post_status).toBe(PostStatusEnum.PostStatusEnum_Draft)
    expect(call!.params[4]).toBe(false)
  })
})
