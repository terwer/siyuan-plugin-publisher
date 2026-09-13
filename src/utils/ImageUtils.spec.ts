/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import ImageUtils from "~/src/utils/ImageUtils.ts"

describe("ImageUtils.escapeRegExp", () => {
  it("escapes local image paths so platform image replacement works for /assets paths", () => {
    const localImage = "/assets/share-pro.png"
    const uploadedImage = "https://cdn.nlark.com/yuque/0/2026/png/26260900/share-pro.png"
    const markdown = `![share](${localImage})`
    const pattern = new RegExp(ImageUtils.escapeRegExp(localImage), "g")

    expect(markdown.replace(pattern, uploadedImage)).toBe(`![share](${uploadedImage})`)
  })
})
