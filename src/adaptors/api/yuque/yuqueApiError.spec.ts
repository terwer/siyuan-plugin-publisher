/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 */

import { describe, expect, it } from "vitest"
import { assertYuqueApiResponse, toYuqueApiUserError } from "~/src/adaptors/api/yuque/yuqueApiError.ts"

describe("assertYuqueApiResponse", () => {
  it("maps 429 to membership/quota guidance", () => {
    expect(() => assertYuqueApiResponse({ status: 429, message: "Too Many Requests" })).toThrow(
      /专业会员|Professional|pricing|yuque.com\/about\/price/i
    )
  })

  it("ignores successful responses", () => {
    expect(() => assertYuqueApiResponse({ status: 200, data: { id: 1 } })).not.toThrow()
  })

  it("maps forwardProxy Too Many Requests throw", () => {
    const err = toYuqueApiUserError(Object.assign(new Error("Too Many Requests"), { status: 429 }))
    expect(err.message).toMatch(/非插件问题|专业会员|429|yuque.com\/about\/price/)
    expect(err.message).not.toMatch(/^Too Many Requests$/i)
  })
})
