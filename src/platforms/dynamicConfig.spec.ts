/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {
  getNewPlatformKey,
  getSubPlatformTypeByKey,
  PlatformType,
  SubPlatformType,
} from "~/src/platforms/dynamicConfig.ts"
import { describe, it, expect } from "vitest"

describe("test dynamicConfig", () => {
  it("test getSubPlatformTypeByKey", () => {
    expect(getSubPlatformTypeByKey("custom_Zhihu")).toBe(SubPlatformType.Custom_Zhihu)
    expect(getSubPlatformTypeByKey("custom_Zhihu-z2jom6d")).toBe(SubPlatformType.Custom_Zhihu)
    expect(getSubPlatformTypeByKey("common_Yuque-z2jom6d")).toBe(SubPlatformType.Common_Yuque)
  })

  it("test getNewPlatformKey", () => {
    const ptype = PlatformType.Common
    const subtype = SubPlatformType.Common_Yuque
    const result = getNewPlatformKey(ptype, subtype)
    console.log("result=>", result)
    expect(result).toMatch(/common_Yuque-\w+/)
  })

})
