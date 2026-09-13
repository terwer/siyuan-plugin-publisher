/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { describe, expect, it } from "vitest"
import {
  buildV2QuickPublishCaughtErrorText,
  buildV2QuickPublishErrorText,
} from "~/src/composables/v2/quickPublishErrorText.ts"

describe("quickPublishErrorText", () => {
  it("extracts CSDN-style remote JSON msg as a short summary", () => {
    const result = buildV2QuickPublishErrorText({
      errMsg:
        'main.opt.failure=>Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}',
      errDetails:
        'Error: {"code":400,"traceId":"9195dc6c-ed82-4cc0-b1c3-f653e5743b26","data":null,"msg":"标题过短"}\n    at throwPluginHttpError',
      fallback: "发布失败",
    })

    expect(result.summary).toBe("标题过短")
    expect(result.details).toContain("traceId")
    expect(result.details).toContain("9195dc6c-ed82-4cc0-b1c3-f653e5743b26")
    expect(result.details).toContain("throwPluginHttpError")
  })

  it("extracts nested message fields without platform-specific branches", () => {
    const result = buildV2QuickPublishErrorText({
      errMsg: 'RequestError: {"code":"bad_request","error":{"message":"专栏不存在或无权限"}}',
      fallback: "发布失败",
    })

    expect(result.summary).toBe("专栏不存在或无权限")
    expect(result.details).toContain("bad_request")
  })

  it("falls back to a cleaned first line for non-json errors", () => {
    const result = buildV2QuickPublishErrorText({
      errMsg: "main.opt.failure=>YuquewebRequestError: 语雀图片上传失败，请确认 Cookie 有效。\n at uploadImage",
      fallback: "发布失败",
    })

    expect(result.summary).toBe("语雀图片上传失败，请确认 Cookie 有效。")
    expect(result.details).toContain("YuquewebRequestError")
  })

  it("redacts sensitive fields in summary and details", () => {
    const result = buildV2QuickPublishErrorText({
      errMsg:
        'Error: {"message":"Cookie: SESSION=secret-session token=secret-token","authorization":"Bearer secret-auth"}',
      errDetails:
        "Cookie: SESSION=secret-session; ctoken=secret-ctoken; Authorization: Bearer secret-auth; ticket=secret-ticket",
      fallback: "发布失败",
    })

    expect(result.summary).toContain("<redacted>")
    expect(result.summary).not.toContain("secret-session")
    expect(result.summary).not.toContain("secret-token")
    expect(result.details).toContain("<redacted>")
    expect(result.details).not.toContain("secret-ctoken")
    expect(result.details).not.toContain("secret-auth")
    expect(result.details).not.toContain("secret-ticket")
  })

  it("keeps caught error stack in details while using the business message as summary", () => {
    const error = new Error('{"message":"标题过短"}')
    error.stack = 'Error: {"message":"标题过短"}\n    at CsdnWebAdaptor.addPost'

    const result = buildV2QuickPublishCaughtErrorText(error, "发布失败")

    expect(result.summary).toBe("标题过短")
    expect(result.details).toContain("CsdnWebAdaptor.addPost")
  })
})
