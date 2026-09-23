/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { aliOssTestExports, getAliOssClient } from "~/src/vendors/alioss/s3oss.ts"

const token = {
  access_id: "access-id",
  access_key: "access-key",
  access_token: "sts-token",
}

describe("getAliOssClient", () => {
  afterEach(() => {
    aliOssTestExports.resetAliOssSdkLoadPromise()
    vi.restoreAllMocks()
  })

  it("uses an existing global OSS constructor", async () => {
    const OSS = vi.fn(function OSS(this: any, options: Record<string, unknown>) {
      this.options = options
    })
    const client = await getAliOssClient("https://zhihu-pics-upload.zhimg.com", "zhihu-pics", token, {
      globalObject: { OSS },
    })

    expect(OSS).toHaveBeenCalledWith({
      endpoint: "https://zhihu-pics-upload.zhimg.com",
      accessKeyId: "access-id",
      accessKeySecret: "access-key",
      stsToken: "sts-token",
      cname: true,
      bucket: "zhihu-pics",
    })
    expect(client.options.bucket).toBe("zhihu-pics")
  })

  it("loads the bundled SDK through plugin require before falling back to script injection", async () => {
    const OSS = vi.fn(function OSS(this: any, options: Record<string, unknown>) {
      this.options = options
    })
    const appInstance = {
      moduleBase: "/data/plugins/siyuan-plugin-publisher/",
      win: {
        require: vi.fn(() => OSS),
      },
    } as any

    const client = await getAliOssClient("https://zhihu-pics-upload.zhimg.com", "zhihu-pics", token, {
      appInstance,
      documentRef: null,
    })

    expect(appInstance.win.require).toHaveBeenCalledWith(
      `/data/plugins/siyuan-plugin-publisher/${aliOssTestExports.ALI_OSS_SDK_PATH}`
    )
    expect(client.options.accessKeyId).toBe("access-id")
  })

  it("loads the bundled browser SDK by injecting a script when OSS is not already available", async () => {
    const OSS = vi.fn(function OSS(this: any, options: Record<string, unknown>) {
      this.options = options
    })
    const globalObject = { OSS: undefined }
    const clientPromise = getAliOssClient("https://zhihu-pics-upload.zhimg.com", "zhihu-pics", token, {
      globalObject,
      scriptUrl: "/plugins/siyuan-plugin-publisher/libs/alioss/aliyun-oss-sdk-6.16.0.min.js",
    })

    const script = document.querySelector("script[data-syp-aliyun-oss-sdk='true']") as HTMLScriptElement
    expect(script).toBeTruthy()
    expect(script.src).toContain("/plugins/siyuan-plugin-publisher/libs/alioss/aliyun-oss-sdk-6.16.0.min.js")

    globalObject.OSS = OSS as any
    script.onload?.(new Event("load"))

    const client = await clientPromise
    expect(client.options.stsToken).toBe("sts-token")
    script.remove()
  })

  it("reports a clear error when neither global OSS nor a browser document is available", async () => {
    await expect(
      getAliOssClient("https://zhihu-pics-upload.zhimg.com", "zhihu-pics", token, {
        globalObject: {},
        documentRef: null,
      })
    ).rejects.toThrow("Aliyun OSS SDK is not available")
  })
})

