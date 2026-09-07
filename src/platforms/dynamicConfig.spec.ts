/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import {
  DynamicConfig,
  getDynCfgByKey,
  getNewPlatformKey,
  getSubPlatformTypeByKey,
  normalizePlatformKey,
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

  it("test normalizePlatformKey", () => {
    expect(normalizePlatformKey("fs_LocalSystem")).toBe("fs_localsystem")
    expect(normalizePlatformKey("fs-localsystem")).toBe("fs_localsystem")
    expect(normalizePlatformKey("fs-LocalSystem-z2jom6d")).toBe("fs_localsystem")
    expect(normalizePlatformKey("fs_LocalSystem-z2jom6d")).toBe("fs_localsystem")
    expect(normalizePlatformKey("custom_Yuqueweb-z1awjla")).toBe("custom_yuqueweb")
    expect(normalizePlatformKey("custom-yuqueweb-z1awjla")).toBe("custom_yuqueweb")
    expect(normalizePlatformKey("wordpress_Wordpressdotcom")).toBe("wordpress_wordpressdotcom")
  })

  it("test getDynCfgByKey matches historical lower-case key", () => {
    const configs = [
      new DynamicConfig(PlatformType.Fs, "fs_LocalSystem", "本地系统"),
      new DynamicConfig(PlatformType.Custom, "custom_Yuqueweb", "语雀网页版"),
      new DynamicConfig(PlatformType.Custom, "custom_Haloweb", "Halo网页版"),
    ]
    // 历史全小写 key（无实例 id）
    expect(getDynCfgByKey(configs, "fs_localsystem")?.platformKey).toBe("fs_LocalSystem")
    expect(getDynCfgByKey(configs, "custom_yuqueweb")?.platformKey).toBe("custom_Yuqueweb")
    // 带实例 id 的历史 key（归一化后命中无 id 配置）
    expect(getDynCfgByKey(configs, "custom_yuqueweb-z1awjla")?.platformKey).toBe("custom_Yuqueweb")
    // 精确匹配仍最优先
    expect(getDynCfgByKey(configs, "custom_Haloweb")?.platformKey).toBe("custom_Haloweb")
    expect(getDynCfgByKey(configs, "custom_Haloweb")?.platformName).toBe("Halo网页版")
    // 不存在
    expect(getDynCfgByKey(configs, "not_exist")).toBeNull()
  })
})
