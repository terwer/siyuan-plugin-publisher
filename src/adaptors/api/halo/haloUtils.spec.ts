/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { AliasTranslator } from "zhi-common"
import HaloUtils from "~/src/adaptors/api/halo/haloUtils.ts"

describe("HaloUtils.generateSlug", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it("UUID 策略生成标准 v4 UUID", async () => {
    const slug = await HaloUtils.generateSlug("测试标题", "UUID")

    expect(slug).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it("Short UUID 策略生成 8 位字母数字别名", async () => {
    const slug = await HaloUtils.generateSlug("测试标题", "shortUUID")

    expect(slug).toMatch(/^[0-9a-zA-Z]{8}$/)
  })

  it("时间戳策略使用毫秒时间戳", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-11-18T00:00:00.000Z"))

    await expect(HaloUtils.generateSlug("测试标题", "timestamp")).resolves.toBe(Date.now().toString())
  })

  it("按标题策略沿用插件既有标题别名规则", async () => {
    const getPageSlug = vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("title-slug-abc123")

    await expect(HaloUtils.generateSlug("测试标题", "generateByTitle")).resolves.toBe("title-slug-abc123")
    expect(getPageSlug).toHaveBeenCalledWith("测试标题", true)
  })

  it("旧版没有策略或未知策略时回退按标题", async () => {
    const getPageSlug = vi.spyOn(AliasTranslator, "getPageSlug").mockResolvedValue("fallback-slug")

    await expect(HaloUtils.generateSlug("测试标题", undefined)).resolves.toBe("fallback-slug")
    await expect(HaloUtils.generateSlug("测试标题", "unknown-strategy")).resolves.toBe("fallback-slug")
    expect(getPageSlug).toHaveBeenCalledTimes(2)
  })
})
