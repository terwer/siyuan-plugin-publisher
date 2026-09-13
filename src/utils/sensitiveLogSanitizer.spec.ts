/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { sanitizeSensitiveForLog } from "~/src/utils/sensitiveLogSanitizer.ts"

describe("sanitizeSensitiveForLog", () => {
  it("redacts Cookie, Authorization, ctoken, token, csrf and ticket in strings", () => {
    const sanitized = sanitizeSensitiveForLog(
      'Cookie=session-secret Authorization=Bearer auth-secret ctoken=ctoken-secret token=token-secret csrf=csrf-secret ticket=ticket-secret url=https://www.yuque.com/api?token=query-secret&ticket=query-ticket {"Authorization":"Bearer json-auth-secret","Cookie":"json-cookie-secret"}'
    )

    expect(sanitized).toContain("<redacted>")
    expect(sanitized).not.toContain("session-secret")
    expect(sanitized).not.toContain("auth-secret")
    expect(sanitized).not.toContain("ctoken-secret")
    expect(sanitized).not.toContain("token-secret")
    expect(sanitized).not.toContain("csrf-secret")
    expect(sanitized).not.toContain("ticket-secret")
    expect(sanitized).not.toContain("query-secret")
    expect(sanitized).not.toContain("query-ticket")
    expect(sanitized).not.toContain("json-auth-secret")
    expect(sanitized).not.toContain("json-cookie-secret")
  })

  it("redacts sensitive object fields recursively", () => {
    const sanitized = sanitizeSensitiveForLog({
      Cookie: "session-secret",
      Authorization: "Bearer auth-secret",
      nested: {
        ctoken: "ctoken-secret",
        token: "token-secret",
        csrf: "csrf-secret",
        ticket: "ticket-secret",
        safe: "visible",
      },
    })

    expect(sanitized.Cookie).toBe("<redacted>")
    expect(sanitized.Authorization).toBe("<redacted>")
    expect(sanitized.nested.ctoken).toBe("<redacted>")
    expect(sanitized.nested.token).toBe("<redacted>")
    expect(sanitized.nested.csrf).toBe("<redacted>")
    expect(sanitized.nested.ticket).toBe("<redacted>")
    expect(sanitized.nested.safe).toBe("visible")
  })
})
