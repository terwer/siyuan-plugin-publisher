/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"

describe("test csdnUtils", () => {
  it("test generateXCaNonce", () => {
    const result = CsdnUtils.generateXCaNonce()
    console.log(result)
  })

  it("test generateXCaSignature", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all"
    const method = "GET"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"
    const xCaSignature = await CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
    expect(xCaSignature).toBe("ifhNtUDVjPe8Qx5iOgFP7r6sGh9ttEO3zYn9H3mZQSM=")
  })

  it("test generateXCaSignature2", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/upgrade-column-pay"
    const method = "POST"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"
    const xCaSignature = await CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
    expect(xCaSignature).toBe("5Wxc4xYUcKvw9tXliIyHb7yQggMZ60KMSp3cxtE4pJ0=")
  })

  it("test generateXCaSignatureForMedia", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all"
    const method = "GET"
    const accept = "*/*"
    const contentType = "application/json"
    const timestamp = "1700000000000"
    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"

    const xCaSignature = await CsdnUtils.generateXCaSignatureForMedia(
      url,
      method,
      accept,
      xCaNonce,
      contentType,
      timestamp
    )

    console.log("x-ca-signature-media:", xCaSignature)
    expect(xCaSignature).toBe("+VtSxo99+lzLiMPIEu0gjwEfDYiVOCgaZ5BLfzXDuRM=")
  })

  it("test generateXCaSignatureForMedia2", async () => {
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/upgrade-column-pay"
    const method = "POST"
    const accept = "*/*"
    const contentType = "application/json"
    const timestamp = "1700000000000"
    const xCaNonce = "123e4567-e89b-42d3-a456-426614174000"

    const xCaSignature = await CsdnUtils.generateXCaSignatureForMedia(
      url,
      method,
      accept,
      xCaNonce,
      contentType,
      timestamp
    )

    console.log("x-ca-signature-media:", xCaSignature)
    expect(xCaSignature).toBe("T7YNBeiPNexLYMRKY/xDw/dI4dHURBS8FVPWafFV3y0=")
  })
})
