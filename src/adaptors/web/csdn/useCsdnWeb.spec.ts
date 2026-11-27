/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it, vi } from "vitest"

const stored = vi.hoisted(() => ({
  setting: {} as Record<string, any>,
}))

vi.mock("~/src/stores/usePublishSettingStore.ts", () => ({
  usePublishSettingStore: () => ({
    getSetting: async () => stored.setting,
  }),
}))

import { useCsdnWeb } from "~/src/adaptors/web/csdn/useCsdnWeb.ts"

describe("useCsdnWeb 封面能力位", () => {
  it("已保存配置里的旧默认值不会关掉封面能力", async () => {
    // 历史配置序列化过 coverEnabled:false / coverMode:"url"，只靠构造器默认值会被覆盖
    stored.setting = {
      custom_Csdn: {
        coverEnabled: false,
        coverMode: "url",
        featuredImageEnabled: false,
        password: "cookie",
      },
    }

    const { cfg } = await useCsdnWeb("custom_Csdn")

    expect(cfg.coverEnabled).toBe(true)
    expect(cfg.featuredImageEnabled).toBe(true)
  })
})
