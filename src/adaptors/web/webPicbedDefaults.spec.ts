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
import { JuejinConfig } from "~/src/adaptors/web/juejin/juejinConfig.ts"
import { ZhihuConfig } from "~/src/adaptors/web/zhihu/zhihuConfig.ts"
import { WechatConfig } from "~/src/adaptors/web/wechat/wechatConfig.ts"

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

  it("uses platform bundled picbed for a newly created Juejin config", () => {
    const cfg = safeMergeConfig<JuejinConfig>("{}", JuejinConfig, ["", "", ""])

    // 掘金双通道：原生直传 + 外链（PicGo）均支持，默认平台图床
    expect(cfg.picgoPicbedSupported).toBe(true)
    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("uses platform bundled picbed for a newly created Wechat config", () => {
    const cfg = safeMergeConfig<WechatConfig>("{}", WechatConfig, ["", "", ""])

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
