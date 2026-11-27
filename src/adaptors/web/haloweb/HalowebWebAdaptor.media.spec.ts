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
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { HalowebConfig } from "~/src/adaptors/web/haloweb/HalowebConfig.ts"
import { HalowebWebAdaptor } from "~/src/adaptors/web/haloweb/HalowebWebAdaptor.ts"

const createAdaptor = () => {
  const cfg = new HalowebConfig("http://localhost:8091")
  cfg.home = "http://localhost:8091"
  cfg.apiUrl = "http://localhost:8091"
  const api = new HalowebWebAdaptor(new PublisherAppInstance(), cfg)
  const webFormFetch = vi.fn()
  ;(api as any).webFormFetch = webFormFetch
  return { api, webFormFetch }
}

const createMedia = () => new MediaObject("image.png", "image/png", Buffer.from("image-bytes"))

describe("HalowebWebAdaptor 媒体上传", () => {
  it("新版本优先走文章附件接口，并解析相对 permalink", async () => {
    const { api, webFormFetch } = createAdaptor()
    webFormFetch.mockResolvedValue({
      metadata: { name: "attachment-1", annotations: {} },
      spec: { displayName: "image.png" },
      status: { permalink: "/upload/image.png" },
    })

    const attachment = await api.newMediaObject(createMedia())

    expect(String(webFormFetch.mock.calls[0][0])).toBe(
      "http://localhost:8091/apis/uc.api.storage.halo.run/v1alpha1/attachments"
    )
    expect(attachment.url).toBe("http://localhost:8091/upload/image.png")
  })

  it("旧版 404 时回退带 default-policy 的接口并解析本地 uri", async () => {
    const { api, webFormFetch } = createAdaptor()
    webFormFetch
      .mockResolvedValueOnce({ status: 404, title: "Not Found" })
      .mockResolvedValueOnce({
        metadata: { name: "attachment-legacy", annotations: { "storage.halo.run/uri": "/upload/image.png" } },
        spec: { displayName: "image.png" },
      })

    const attachment = await api.newMediaObject(createMedia())

    expect(webFormFetch).toHaveBeenCalledTimes(2)
    expect(String(webFormFetch.mock.calls[1][0])).toBe(
      "http://localhost:8091/apis/api.console.halo.run/v1alpha1/attachments/upload"
    )
    expect(attachment.url).toBe("http://localhost:8091/upload/image.png")
  })
})
