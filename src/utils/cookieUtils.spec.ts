/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, it } from "vitest"
import CookieUtils from "~/src/utils/cookieUtils.ts"

describe("test cookieUtis", () => {
  it("test addCookieArray1", async () => {
    const originCookieArray = []
    const newCookieArray = [
      "tph_uuid=ZhFG27K3tQ3KW5GyjCztQD3DvgoVPAfNSStSYbVrZX; expires=Tue, 25 Feb 2025 00:41:28 GMT;",
      "cookie2=test2",
    ]
    const result = CookieUtils.addCookieArray(originCookieArray, newCookieArray)
    console.log("result=>", result)
  })

  it("test addCookieArray2", async () => {
    const originCookieArray = []
    const newCookieArray = [
      "tph_uuid=ZhFG27K3tQ3KW5GyjCztQD3DvgoVPAfNSStSYbVrZX; expires=Tue, 25 Feb 2025 00:41:28 GMT;",
      "tph_uuid=ZhFG27K3tQ3KW5GyjCztQD3DvgoVPAfNSStSYbVrZC; expires=Tue, 25 Feb 2025 00:45:28 GMT;",
    ]
    const result = CookieUtils.addCookieArray(originCookieArray, newCookieArray)
    console.log("result=>", result)
  })

  it("test getCookieObject", async () => {
    const cookieArray = ["tph_uuid=ZhFG27K3tQ3KW5GyjCztQD3DvgoVPAfNSStSYbVrZX; expires=Tue, 25 Feb 2025 00:41:28 GMT;"]
    const result = CookieUtils.getCookieObject(cookieArray, "tph_uuid")
    console.log("result=>", result)
  })

  it("test getCookie", async () => {
    const cookieArray = ["tph_uuid=ZhFG27K3tQ3KW5GyjCztQD3DvgoVPAfNSStSYbVrZX; expires=Tue, 25 Feb 2025 00:41:28 GMT;"]
    const result = CookieUtils.getCookie(cookieArray, "tph_uuid")
    console.log("result=>", result)
  })
})
