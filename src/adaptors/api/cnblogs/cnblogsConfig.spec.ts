import { PicbedServiceTypeEnum } from "zhi-blog-api"
import { describe, expect, it } from "vitest"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"

describe("CnblogsConfig", () => {
  it("defaults picbed to bundled platform upload", () => {
    const cfg = new CnblogsConfig("https://rpc.cnblogs.com/metaweblog/demo", "demo", "token")

    expect(cfg.bundledPicbedSupported).toBe(true)
    expect(cfg.picbedService).toBe(PicbedServiceTypeEnum.Bundled)
  })
})
