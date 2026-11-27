/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"
import { MediaObject } from "zhi-blog-api"
import {
  getHaloCacheAttrKey,
  hashMediaBits,
  readHaloMediaCache,
  uploadHaloMediaWithCache,
} from "~/src/utils/haloMediaCache.ts"
import { normalizeMediaCacheEndpoint, setMediaCacheContext, type MediaCacheContext } from "~/src/utils/mediaCacheContext.ts"

const createContext = () => {
  const attrs: Record<string, string> = {}
  const kernelApi = {
    getBlockAttrs: vi.fn(async () => ({ ...attrs })),
    setSingleBlockAttr: vi.fn(async (_id: string, key: string, value: string) => {
      attrs[key] = value
    }),
  }
  const context: MediaCacheContext = {
    kernelApi,
    docId: "doc-1",
    platformKey: "common_Halo",
    endpoint: normalizeMediaCacheEndpoint("http://localhost:8091/"),
  }
  return { attrs, context }
}

const createMedia = (content: string) => new MediaObject("image.png", "image/png", Buffer.from(content))

const createAttachment = (url: string) => ({
  attachment_id: "display.png",
  id: "attachment-1",
  url,
  link: url,
  title: "image.png",
  file: "image.png",
  type: "image/png",
})

describe("haloMediaCache", () => {
  it("hashes identical media identically and different media differently", async () => {
    const first = await hashMediaBits(Buffer.from("same"))
    const second = await hashMediaBits(Buffer.from("same"))
    const third = await hashMediaBits(Buffer.from("different"))

    expect(first).toBe(second)
    expect(first).not.toBe(third)
  })

  it("reuses the uploaded attachment for the same media content", async () => {
    const { context } = createContext()
    const upload = vi.fn(async () => createAttachment("http://localhost:8091/upload/image.png"))

    const first = createMedia("same-bytes")
    setMediaCacheContext(first, context)
    await uploadHaloMediaWithCache(first, { upload })

    const second = createMedia("same-bytes")
    setMediaCacheContext(second, context)
    const reused = await uploadHaloMediaWithCache(second, { upload })

    expect(upload).toHaveBeenCalledTimes(1)
    expect(reused.url).toBe("http://localhost:8091/upload/image.png")
  })

  it("uploads again when the media content changes", async () => {
    const { context } = createContext()
    let index = 0
    const upload = vi.fn(async () => createAttachment(`http://localhost:8091/upload/image-${++index}.png`))

    const first = createMedia("first")
    setMediaCacheContext(first, context)
    await uploadHaloMediaWithCache(first, { upload })

    const second = createMedia("second")
    setMediaCacheContext(second, context)
    const changed = await uploadHaloMediaWithCache(second, { upload })

    expect(upload).toHaveBeenCalledTimes(2)
    expect(changed.url).toBe("http://localhost:8091/upload/image-2.png")
  })

  it("re-uploads when the cached attachment no longer exists", async () => {
    const { context } = createContext()
    const upload = vi.fn(async () => createAttachment("http://localhost:8091/upload/image.png"))

    const first = createMedia("same-bytes")
    setMediaCacheContext(first, context)
    await uploadHaloMediaWithCache(first, { upload, isAttachmentAlive: async () => true })

    const second = createMedia("same-bytes")
    setMediaCacheContext(second, context)
    await uploadHaloMediaWithCache(second, { upload, isAttachmentAlive: async () => false })

    expect(upload).toHaveBeenCalledTimes(2)
  })

  it("does not reuse entries from another Halo endpoint", async () => {
    const { context } = createContext()
    const upload = vi.fn(async () => createAttachment("http://localhost:8091/upload/image.png"))

    const first = createMedia("same-bytes")
    setMediaCacheContext(first, context)
    await uploadHaloMediaWithCache(first, { upload })

    const other: MediaCacheContext = { ...context, endpoint: normalizeMediaCacheEndpoint("http://localhost:8092") }
    const second = createMedia("same-bytes")
    setMediaCacheContext(second, other)
    await uploadHaloMediaWithCache(second, { upload })

    expect(upload).toHaveBeenCalledTimes(2)
  })

  it("ignores caches written before storage-policy-aware uploads", async () => {
    const { attrs, context } = createContext()
    attrs[getHaloCacheAttrKey(context.platformKey, context.endpoint, "media-cache")] = JSON.stringify({
      version: 1,
      endpoint: context.endpoint,
      items: {
        "legacy-hash": {
          name: "image.png",
          url: "http://localhost:8091/upload/image.png",
          attachmentId: "legacy-attachment",
          updatedAt: Date.now(),
        },
      },
    })

    const cache = await readHaloMediaCache(context)

    expect(cache.items).toEqual({})
  })

  it("builds stable cache keys per platform and endpoint", () => {
    expect(getHaloCacheAttrKey("common_Halo", "http://localhost:8091", "media-cache")).toBe(
      "custom-halo-common-halo-media-cache"
    )
    expect(getHaloCacheAttrKey("", "http://localhost:8091", "media-cache")).toContain("custom-halo-endpoint-")
  })

  it("returns an empty cache for missing data", async () => {
    const { context } = createContext()
    const cache = await readHaloMediaCache(context)

    expect(cache.items).toEqual({})
    expect(cache.endpoint).toBe("http://localhost:8091")
  })
})
