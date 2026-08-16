/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { PicbedServiceTypeEnum } from "zhi-blog-api"
import { safeMergeConfig } from "~/src/adaptors/api/base/configMergeUtil.ts"
import { CsdnConfig } from "~/src/adaptors/web/csdn/csdnConfig.ts"
import { JianshuConfig } from "~/src/adaptors/web/jianshu/jianshuConfig.ts"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"

describe("web platform bundled picbed defaults", () => {
  it("uses platform bundled picbed for a newly created Zhihu config", () => {
    const cfg = safeMergeConfig<ZhihuConfig>("{}", ZhihuConfig, ["", "", ""])

    expect(cfg.picgoPicbedSupported).toBe(false)
    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("uses platform bundled picbed for a newly created CSDN config", () => {
    const cfg = safeMergeConfig<CsdnConfig>("{}", CsdnConfig, ["", "", ""])

    expect(cfg.picgoPicbedSupported).toBe(false)
    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("uses platform bundled picbed for a newly created Jianshu config", () => {
    const cfg = safeMergeConfig<JianshuConfig>("{}", JianshuConfig, ["", "", ""])

    expect(cfg.picgoPicbedSupported).toBe(false)
    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("does not override an explicitly stored no-picbed choice", () => {
    const cfg = safeMergeConfig<ZhihuConfig>(
      JSON.stringify({ picbedService: PicbedServiceTypeEnum.None }),
      ZhihuConfig,
      ["", "", ""]
    )

    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.None)
  })
})
