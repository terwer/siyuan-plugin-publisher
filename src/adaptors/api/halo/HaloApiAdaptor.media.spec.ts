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
import { HaloConfig } from "~/src/adaptors/api/halo/HaloConfig.ts"
import { HaloApiAdaptor } from "~/src/adaptors/api/halo/HaloApiAdaptor.ts"

const createAdaptor = () => {
  const cfg = new HaloConfig("admin", "password")
  cfg.home = "http://localhost:8091"
  cfg.apiUrl = "http://localhost:8091"
  const api = new HaloApiAdaptor(new PublisherAppInstance(), cfg)
  const apiFormFetch = vi.fn()
  ;(api as any).apiFormFetch = apiFormFetch
  return { api, apiFormFetch }
}

const createMedia = () => new MediaObject("image.png", "image/png", Buffer.from("image-bytes"))

describe("HaloApiAdaptor 媒体上传", () => {
  it("新版本优先走文章附件接口，并解析 S3 外部地址", async () => {
    const { api, apiFormFetch } = createAdaptor()
    apiFormFetch.mockResolvedValue({
      metadata: {
        name: "attachment-1",
        annotations: { "storage.halo.run/external-link": "https://cdn.example.com/image.png" },
      },
      spec: { displayName: "image.png" },
      status: { permalink: "https://cdn.example.com/image.png" },
    })

    const attachment = await api.newMediaObject(createMedia())

    expect(String(apiFormFetch.mock.calls[0][0])).toBe(
      "http://localhost:8091/apis/uc.api.storage.halo.run/v1alpha1/attachments"
    )
    expect((apiFormFetch.mock.calls[0][2] as FormData).get("policyName")).toBeNull()
    expect(attachment.url).toBe("https://cdn.example.com/image.png")
    expect(attachment.id).toBe("attachment-1")
  })

  it("旧版 404 时回退带 default-policy 的接口", async () => {
    const { api, apiFormFetch } = createAdaptor()
    apiFormFetch
      .mockResolvedValueOnce({ status: 404, title: "Not Found" })
      .mockResolvedValueOnce({
        metadata: { name: "attachment-legacy", annotations: { "storage.halo.run/uri": "/upload/image.png" } },
        spec: { displayName: "image.png" },
      })

    const attachment = await api.newMediaObject(createMedia())

    expect(apiFormFetch).toHaveBeenCalledTimes(2)
    expect(String(apiFormFetch.mock.calls[1][0])).toBe(
      "http://localhost:8091/apis/api.console.halo.run/v1alpha1/attachments/upload"
    )
    expect((apiFormFetch.mock.calls[1][2] as FormData).get("policyName")).toBe("default-policy")
    expect(attachment.url).toBe("http://localhost:8091/upload/image.png")
  })

  it("重定向到登录页时保留 Basic Auth 可操作提示", async () => {
    const { api, apiFormFetch } = createAdaptor()
    apiFormFetch.mockResolvedValue("<!doctype html><html><body>login</body></html>")

    await expect(api.newMediaObject(createMedia())).rejects.toThrow(/Basic Auth/)
  })
})
