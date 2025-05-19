/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { getNewPlatformKey, getSubPlatformTypeByKey, PlatformType, SubPlatformType } from "@/models/dynamicConfig.ts"
import { describe, it, expect } from "vitest"

describe("test dynamicConfig", () => {
  // it("test getSubPlatformTypeByKey", () => {
  //   // const key = "custom_Zhihu-z2jom6d"
  //   const key = "custom_Zhihu"
  //   const result = getSubPlatformTypeByKey(key)
  //   console.log("result=>", result)
  //   expect(result).toBe(SubPlatformType.Custom_Zhihu)
  // })
  //
  // it("test getNewPlatformKey", () => {
  //   const ptype = PlatformType.Common
  //   const subtype = SubPlatformType.Common_Yuque
  //   const result = getNewPlatformKey(ptype, subtype)
  //   console.log("result=>", result)
  //   expect(result).toMatch(/common_Yuque-\w+/)
  // })
})
