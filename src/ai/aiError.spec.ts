/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { aiErrorI18nKey, aiParseFailureI18nKey, classifyAiError } from "~/src/ai/aiError.ts"

describe("aiError", () => {
  it("classifies timeout/auth/request errors", () => {
    expect(classifyAiError(new Error("Request timed out"))).toBe("timeout")
    expect(classifyAiError({ name: "TimeoutError", message: "aborted" })).toBe("timeout")
    expect(classifyAiError(new Error("401 Unauthorized"))).toBe("auth")
    expect(classifyAiError(new Error("invalid api key"))).toBe("auth")
    expect(classifyAiError(new Error("socket hang up"))).toBe("request")
    expect(classifyAiError(undefined)).toBe("request")
  })

  it("maps reasons to i18n keys", () => {
    expect(aiErrorI18nKey("timeout")).toBe("ai.error.timeout")
    expect(aiErrorI18nKey("auth")).toBe("ai.error.auth")
    expect(aiParseFailureI18nKey("empty")).toBe("ai.error.empty")
    expect(aiParseFailureI18nKey("invalid-json")).toBe("ai.error.format")
  })
})
