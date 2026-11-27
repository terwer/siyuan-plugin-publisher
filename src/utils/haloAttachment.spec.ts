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
  createHaloAttachment,
  HALO_CONSOLE_ATTACHMENT_UPLOAD_PATH,
  HALO_LEGACY_ATTACHMENT_POLICY,
  HALO_POST_ATTACHMENT_UPLOAD_PATH,
  HaloAttachmentUploader,
  isHaloPostAttachmentUnavailable,
  resolveHaloAttachmentUrl,
} from "~/src/utils/haloAttachment.ts"

const createMedia = () => new MediaObject("image.png", "image/png", Buffer.from("image"))

describe("resolveHaloAttachmentUrl", () => {
  it("用站点地址补全本地存储的相对路径", () => {
    const response = {
      metadata: { annotations: { "storage.halo.run/uri": "/upload/image.png" } },
    }

    expect(resolveHaloAttachmentUrl("http://localhost:8091/", response)).toBe(
      "http://localhost:8091/upload/image.png"
    )
  })

  it("优先使用 S3 等外部存储的绝对地址", () => {
    const response = {
      metadata: {
        annotations: {
          "storage.halo.run/uri": "/upload/image.png",
          "storage.halo.run/external-link": "https://cdn.example.com/blog/image.png",
        },
      },
    }

    expect(resolveHaloAttachmentUrl("https://halo.example.com", response)).toBe(
      "https://cdn.example.com/blog/image.png"
    )
  })

  it("优先使用文章附件接口返回的 permalink", () => {
    const response = {
      status: { permalink: "/upload/image.png" },
      metadata: { annotations: { "storage.halo.run/uri": "/upload/fallback.png" } },
    }

    expect(resolveHaloAttachmentUrl("https://halo.example.com/", response)).toBe(
      "https://halo.example.com/upload/image.png"
    )
  })

  it("保持绝对 permalink 不变", () => {
    const response = { status: { permalink: "https://cdn.example.com/image.png" } }

    expect(resolveHaloAttachmentUrl("https://halo.example.com", response)).toBe(
      "https://cdn.example.com/image.png"
    )
  })

  it("没有可用地址时返回空字符串", () => {
    expect(resolveHaloAttachmentUrl("https://halo.example.com", { metadata: {} })).toBe("")
  })
})

describe("isHaloPostAttachmentUnavailable", () => {
  it("只在旧版路由缺失时判定回退", () => {
    expect(isHaloPostAttachmentUnavailable({ status: 404, detail: "No static resource apis/uc..." })).toBe(true)
    expect(isHaloPostAttachmentUnavailable({ status: 405 })).toBe(true)
    expect(isHaloPostAttachmentUnavailable({ status: 404 })).toBe(true)
    expect(isHaloPostAttachmentUnavailable({ status: 403 })).toBe(false)
    expect(isHaloPostAttachmentUnavailable({ status: 200 })).toBe(false)
    expect(isHaloPostAttachmentUnavailable(undefined)).toBe(false)
  })

  it("存储策略不存在时不能误判为旧版回退", () => {
    const response = {
      status: 404,
      detail: "Extension storage.halo.run/v1alpha1/Policy/s3-policy was not found.",
    }

    expect(isHaloPostAttachmentUnavailable(response)).toBe(false)
  })
})

describe("createHaloAttachment", () => {
  it("把 Halo 返回的附件映射成统一 Attachment", () => {
    const attachment = createHaloAttachment("https://halo.example.com", createMedia(), {
      metadata: { name: "attachment-1", annotations: { "storage.halo.run/uri": "/upload/image.png" } },
      spec: { displayName: "image.png" },
    })

    expect(attachment.url).toBe("https://halo.example.com/upload/image.png")
    expect(attachment.link).toBe(attachment.url)
    expect(attachment.id).toBe("attachment-1")
    expect(attachment.attachment_id).toBe("image.png")
  })

  it("缺少图片地址时抛出可诊断错误", () => {
    expect(() => createHaloAttachment("https://halo.example.com", createMedia(), { metadata: {} })).toThrow(
      /未返回图片地址/
    )
  })
})

describe("HaloAttachmentUploader", () => {
  it("优先走文章附件接口，表单不携带存储策略", async () => {
    const uploadToPostAttachments = vi.fn(async (formData: FormData) => {
      expect(formData.get("file")).toBeTruthy()
      expect(formData.get("policyName")).toBeNull()
      return { metadata: { name: "attachment-1" } }
    })
    const uploadToConsoleAttachments = vi.fn()
    const uploader = new HaloAttachmentUploader({ uploadToPostAttachments, uploadToConsoleAttachments })

    const response = await uploader.upload({ win: window }, createMedia())

    expect(response.metadata.name).toBe("attachment-1")
    expect(uploadToPostAttachments).toHaveBeenCalledTimes(1)
    expect(uploadToConsoleAttachments).not.toHaveBeenCalled()
  })

  it("旧版 404 时回退旧入口并缓存能力探测结果", async () => {
    const uploadToPostAttachments = vi
      .fn()
      .mockResolvedValueOnce({ status: 404, title: "Not Found" })
      .mockRejectedValueOnce(new Error("should not be called again"))
    const uploadToConsoleAttachments = vi.fn(async (formData: FormData) => {
      expect(formData.get("policyName")).toBe(HALO_LEGACY_ATTACHMENT_POLICY)
      return { metadata: { name: "attachment-legacy" } }
    })
    const uploader = new HaloAttachmentUploader({ uploadToPostAttachments, uploadToConsoleAttachments })

    await expect(uploader.upload({ win: window }, createMedia())).resolves.toEqual({
      metadata: { name: "attachment-legacy" },
    })
    await expect(uploader.upload({ win: window }, createMedia())).resolves.toEqual({
      metadata: { name: "attachment-legacy" },
    })

    expect(uploadToPostAttachments).toHaveBeenCalledTimes(1)
    expect(uploadToConsoleAttachments).toHaveBeenCalledTimes(2)
  })

  it("403 等鉴权错误不回退本地存储", async () => {
    const uploadToPostAttachments = vi.fn().mockResolvedValue({ status: 403, title: "Forbidden" })
    const uploadToConsoleAttachments = vi.fn()
    const uploader = new HaloAttachmentUploader({ uploadToPostAttachments, uploadToConsoleAttachments })

    const response = await uploader.upload({ win: window }, createMedia())

    expect(response.status).toBe(403)
    expect(uploadToConsoleAttachments).not.toHaveBeenCalled()
  })

  it("站点配置的存储策略不存在时直接报错，不回退本地存储", async () => {
    const uploadToPostAttachments = vi.fn().mockResolvedValue({
      status: 404,
      detail: "Extension storage.halo.run/v1alpha1/Policy/s3-policy was not found.",
    })
    const uploadToConsoleAttachments = vi.fn()
    const uploader = new HaloAttachmentUploader({ uploadToPostAttachments, uploadToConsoleAttachments })

    await expect(uploader.upload({ win: window }, createMedia())).rejects.toThrow(/存储策略不可用/)
    expect(uploadToConsoleAttachments).not.toHaveBeenCalled()
  })

  it("使用文章附件接口时只请求一次上传地址", async () => {
    const uploadToPostAttachments = vi.fn().mockResolvedValue({ metadata: { name: "attachment-1" } })
    const uploader = new HaloAttachmentUploader({
      uploadToPostAttachments,
      uploadToConsoleAttachments: vi.fn(),
    })

    await uploader.upload({ win: window }, createMedia())

    expect(HALO_POST_ATTACHMENT_UPLOAD_PATH).toContain("/apis/uc.api.storage.halo.run/v1alpha1/attachments")
    expect(HALO_CONSOLE_ATTACHMENT_UPLOAD_PATH).toContain("/apis/api.console.halo.run/v1alpha1/attachments/upload")
    expect(uploadToPostAttachments).toHaveBeenCalledTimes(1)
  })
})
