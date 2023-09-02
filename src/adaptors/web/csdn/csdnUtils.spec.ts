/*
 * Copyright (c) 2023, Terwer . All rights reserved.
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
