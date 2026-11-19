/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { resolveFeaturedImageUrl, toFeaturedImageMediaName } from "~/src/utils/featuredImageMedia.ts"

describe("featuredImageMedia util", () => {
  it("resolves a siyuan asset against the kernel api url", () => {
    expect(resolveFeaturedImageUrl("assets/cover.png", "http://127.0.0.1:6806/")).toBe(
      "http://127.0.0.1:6806/assets/cover.png"
    )
    expect(resolveFeaturedImageUrl("/assets/cover.png", "http://127.0.0.1:6806")).toBe(
      "http://127.0.0.1:6806/assets/cover.png"
    )
  })

  it("keeps absolute and data urls unchanged", () => {
    expect(resolveFeaturedImageUrl("https://img.example.com/a.png", "http://127.0.0.1:6806")).toBe(
      "https://img.example.com/a.png"
    )
    expect(resolveFeaturedImageUrl("data:image/png;base64,eA==", "http://127.0.0.1:6806")).toBe(
      "data:image/png;base64,eA=="
    )
  })

  it("strips query strings and hash before using the media name", () => {
    expect(toFeaturedImageMediaName("cover.png?x=1#hash", "image/png")).toBe("cover.png")
    expect(toFeaturedImageMediaName("unknown-image", "image/webp")).toMatch(/^featured-image-\d+\.webp$/)
  })
})
