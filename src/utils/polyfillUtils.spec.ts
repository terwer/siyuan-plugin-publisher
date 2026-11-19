/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { remoteImageToBase64Info } from "~/src/utils/polyfillUtils.ts"

describe("remoteImageToBase64Info", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("rejects an unauthenticated image response instead of treating it as image bytes", async () => {
    const doFetch = vi.fn(async () => new Response("", { status: 401 }))
    vi.stubGlobal("fetch", doFetch)
    ;(window as any).fetch = doFetch

    await expect(remoteImageToBase64Info("https://notes.example.com/assets/a.png")).rejects.toThrow("HTTP 401")
    expect(doFetch).toHaveBeenCalledWith(
      "https://notes.example.com/assets/a.png",
      expect.objectContaining({ credentials: "same-origin" })
    )
  })
})
