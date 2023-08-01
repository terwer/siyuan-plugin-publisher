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

import {
  getNewPlatformKey,
  getSubPlatformTypeByKey,
  PlatformType,
  SubPlatformType,
} from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { describe, it, expect } from "vitest"

describe("test dynamicConfig", () => {
  it("test getSubPlatformTypeByKey", () => {
    // const key = "custom_Zhihu-z2jom6d"
    const key = "custom_Zhihu"
    const result = getSubPlatformTypeByKey(key)
    console.log("result=>", result)
    expect(result).toBe(SubPlatformType.Custom_Zhihu)
  })

  it("test getNewPlatformKey", () => {
    const ptype = PlatformType.Common
    const subtype = SubPlatformType.Common_Yuque
    const result = getNewPlatformKey(ptype, subtype)
    console.log("result=>", result)
    expect(result).toMatch(/common_Zhihu-\w+/)
  })
})
