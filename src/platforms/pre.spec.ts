/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import {
  getAllPrePlatformDefinitions,
  getPrePlatformI18nConfig,
  localizePrePlatform,
  localizePrePlatforms,
  resolvePrePlatformI18nField,
} from "~/src/composables/usePlatformDefine.ts"
import { PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { pre } from "~/src/platforms/pre.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"
import enUS from "~/siyuan/i18n/en_US.json"

const t = (messages: Record<string, string>, key: string) => messages[key] ?? key

describe("platform presets", () => {
  const zhDraftPhrases = [
    ["发布", "预设"].join(""),
    ["采用", " API ", "授权"].join(""),
    ["网页", " Cookie ", "授权"].join(""),
    ["xxx", "预设"].join(""),
    ["预设", "平台"].join(""),
  ]
  const enDraftPhrases = [
    ["publishing", "preset"].join(" "),
    ["API", "authorization"].join(" "),
    ["web", "Cookie", "authorization"].join(" "),
    ["Customize", "the", "HTTP", "protocol"].join(" "),
    ["stay", "tuned"].join(" "),
  ]

  it("stores generic i18n field mappings on every visible preset platform", () => {
    const visiblePresetPlatforms = getAllPrePlatformDefinitions()

    expect(visiblePresetPlatforms.length).toBeGreaterThan(0)
    expect(visiblePresetPlatforms.every((item) => item.i18n?.description?.trim())).toBe(true)
    expect(visiblePresetPlatforms.every((item) => !item.description?.trim())).toBe(true)
  })

  it("keeps V2-visible platform descriptions in pre.ts as i18n mappings rather than a separate map", () => {
    expect(pre.commonCfg.find((item) => item.platformKey === "common_Yuque")?.i18n?.description).toBe(
      "setting.platform.common.yuque.desc"
    )
    expect(pre.githubCfg.find((item) => item.platformKey === "github_Hexo")?.i18n?.description).toBe(
      "setting.platform.github.hexo.desc"
    )
    expect(pre.customCfg.find((item) => item.platformKey === "custom_Yuqueweb")?.i18n?.description).toBe(
      "setting.platform.custom.yuqueweb.desc"
    )
    expect(pre.fsCfg.find((item) => item.platformKey === "fs_LocalSystem")?.i18n?.description).toBe(
      "setting.platform.fs.desc"
    )
  })

  it("provides zh_CN and en_US translations for every preset i18n field", () => {
    const visiblePresetPlatforms = getAllPrePlatformDefinitions()

    for (const platform of visiblePresetPlatforms) {
      for (const i18nKey of Object.values(getPrePlatformI18nConfig(platform))) {
        expect(zhCN[i18nKey], i18nKey).toBeTruthy()
        expect(enUS[i18nKey], i18nKey).toBeTruthy()
      }
    }
  })

  it("keeps platform descriptions as product copy rather than engineering draft text", () => {
    const visiblePresetPlatforms = getAllPrePlatformDefinitions()

    for (const platform of visiblePresetPlatforms) {
      const descriptionI18nKey = platform.i18n?.description
      expect(descriptionI18nKey, platform.platformKey).toBeTruthy()

      const zhDescription = t(zhCN, descriptionI18nKey!)
      const enDescription = t(enUS, descriptionI18nKey!)

      expect(zhDescription, platform.platformKey).not.toBe(descriptionI18nKey)
      expect(enDescription, platform.platformKey).not.toBe(descriptionI18nKey)
      expect(zhDescription.length, platform.platformKey).toBeGreaterThan(8)
      expect(enDescription.length, platform.platformKey).toBeGreaterThan(16)

      for (const phrase of zhDraftPhrases) {
        expect(zhDescription, `${platform.platformKey} should not contain ${phrase}`).not.toContain(phrase)
      }
      for (const phrase of enDraftPhrases) {
        expect(enDescription, `${platform.platformKey} should not contain ${phrase}`).not.toContain(phrase)
      }
    }
  })

  it("localizes arbitrary preset fields without hard-coding description", () => {
    const platform = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Yuque_Test",
      platformName: "Yuque test",
      platformIcon: "",
      i18n: {
        platformName: "setting.platform.common.yuque.desc",
        description: "setting.platform.common.yuque.desc",
      },
      authMode: pre.commonCfg[0].authMode,
      isEnabled: false,
      isAuth: false,
      isSys: false,
    } as DynamicConfig

    const localized = localizePrePlatform(platform, (key) => t(zhCN, key))

    expect(localized.platformName).toBe(zhCN["setting.platform.common.yuque.desc"])
    expect(localized.description).toBe(zhCN["setting.platform.common.yuque.desc"])
    expect(platform.platformName).toBe("Yuque test")
    expect(platform.description).toBeUndefined()
  })

  it("resolves a single arbitrary i18n field for display fallbacks", () => {
    const yuqueweb = pre.customCfg.find((item) => item.platformKey === "custom_Yuqueweb")!

    expect(resolvePrePlatformI18nField(yuqueweb, "description", (key) => t(zhCN, key))).toBe(
      zhCN["setting.platform.custom.yuqueweb.desc"]
    )
  })

  it("localizes preset lists without mutating the original pre.ts data", () => {
    const localized = localizePrePlatforms(pre.customCfg, (key) => t(zhCN, key))
    const yuqueweb = localized.find((item) => item.platformKey === "custom_Yuqueweb")

    expect(yuqueweb?.description).toBe(zhCN["setting.platform.custom.yuqueweb.desc"])
    expect(pre.customCfg.find((item) => item.platformKey === "custom_Yuqueweb")?.description).toBeUndefined()
  })
})
