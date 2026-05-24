/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { hmacSha256Base64, md5Hex } from "~/src/utils/cryptoUtils.ts"

describe("cryptoUtils", () => {
  it("md5Hex supports Uint8Array", () => {
    expect(md5Hex(new Uint8Array([97, 98, 99]))).toBe("900150983cd24fb0d6963f7d28e17f72")
  })

  it("hmacSha256Base64 supports fixed vector", async () => {
    await expect(hmacSha256Base64("key", "The quick brown fox jumps over the lazy dog")).resolves.toBe(
      "97yD9DBThCSxMpjmqm+xQ+9NWaFJRhdZl0edvC0aPNg="
    )
  })
})
