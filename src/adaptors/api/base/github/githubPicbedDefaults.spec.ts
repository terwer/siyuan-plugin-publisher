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
import { CommonGithubConfig } from "~/src/adaptors/api/base/github/commonGithubConfig.ts"
import { HexoConfig } from "~/src/adaptors/api/hexo/hexoConfig.ts"

describe("git platform bundled picbed defaults", () => {
  it("uses platform bundled picbed for a newly created Hexo config", () => {
    const cfg = safeMergeConfig<HexoConfig>("{}", HexoConfig, ["", "", "", "", ""])

    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("uses platform bundled picbed for the base CommonGithubConfig", () => {
    const cfg = safeMergeConfig<CommonGithubConfig>("{}", CommonGithubConfig, ["", "", "", "", ""])

    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })

  it("does not override an explicitly stored no-picbed choice", () => {
    const cfg = safeMergeConfig<HexoConfig>(
      JSON.stringify({ picbedService: PicbedServiceTypeEnum.None }),
      HexoConfig,
      ["", "", "", "", ""]
    )

    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.None)
  })
})
