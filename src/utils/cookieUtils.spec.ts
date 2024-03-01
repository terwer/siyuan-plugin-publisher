/*
 * Copyright (c) 2024, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
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
