/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, it } from "vitest"
import CsdnUtils from "~/src/adaptors/web/csdn/csdnUtils.ts"

describe("test csdnUtils", () => {
  it("test generateXCaNonce", () => {
    const result = CsdnUtils.generateXCaNonce()
    console.log(result)
  })

  it("test generateXCaSignature", () => {
    // const url = "https://bizapi.csdn.net/blog-console-api/v1/user/info"
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/list?type=all"
    const method = "GET"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = CsdnUtils.generateXCaNonce()
    const xCaSignature = CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
  })

  it("test generateXCaSignature2", () => {
    // const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/save"
    const url = "https://bizapi.csdn.net/blog/phoenix/console/v1/column/upgrade-column-pay"
    const method = "POST"
    const accept = "*/*"
    const contentType = "application/json"

    const xCaNonce = CsdnUtils.generateXCaNonce()
    const xCaSignature = CsdnUtils.generateXCaSignature(url, method, accept, xCaNonce, contentType)

    console.log("x-ca-nonce:", xCaNonce)
    console.log("x-ca-signature:", xCaSignature)
  })
})
