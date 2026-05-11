/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createI18n } from "vue-i18n"
import { createPinia, setActivePinia } from "pinia"
import { describe, expect, it, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { useV2Settings } from "~/src/composables/v2/useV2Settings.ts"
import { setDynamicJsonCfg, PlatformType, SubPlatformType, type DynamicConfig } from "~/src/platforms/dynamicConfig.ts"
import { pre } from "~/src/platforms/pre.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

describe("useV2Settings", () => {
  const mountHarness = async (initialDynamicConfig: DynamicConfig[]) => {
    let exposed: ReturnType<typeof useV2Settings>

    const Harness = defineComponent({
      setup() {
        exposed = useV2Settings()
        return () => h("div")
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)

    const setting = {
      [DYNAMIC_CONFIG_KEY]: setDynamicJsonCfg(initialDynamicConfig),
    }
    const store = usePublishSettingStore()
    store.getSetting = vi.fn().mockResolvedValue(setting as any)
    store.updateSetting = vi.fn().mockResolvedValue(undefined as any)

    mount(Harness, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: "zh_CN",
            messages: {
              zh_CN: zhCN,
            },
          }),
          pinia,
        ],
      },
    })

    await exposed!.loadAccountItems()
    return exposed!
  }

  it("builds selectable platforms from pre.ts i18n field mappings", async () => {
    const settings = await mountHarness([])
    const yuque = settings.selectablePlatforms.value.find((item) => item.platformKey === "common_Yuque")
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!

    expect(preset.description).toBeUndefined()
    expect(yuque?.description).toBe(zhCN[preset.i18n!.description])
  })

  it("falls back to translated preset descriptions for legacy account configs without description", async () => {
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!
    const legacyYuque = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Yuque-legacy",
      platformName: "语雀旧账号",
      isEnabled: true,
      isAuth: true,
      authMode: preset.authMode,
      isSys: false,
    } as DynamicConfig

    const settings = await mountHarness([legacyYuque])
    const account = settings.state.accountItems[0]

    expect(account.description).toBe(zhCN[preset.i18n!.description])
  })

  it("uses stored description only after trying the stored i18n mapping", async () => {
    const legacyYuque = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Yuque-legacy",
      platformName: "语雀旧账号",
      i18n: { description: "setting.platform.common.yuque.desc" },
      description: "旧的已保存描述",
      isEnabled: true,
      isAuth: true,
      authMode: pre.commonCfg[0].authMode,
      isSys: false,
    } as DynamicConfig

    const settings = await mountHarness([legacyYuque])
    const account = settings.state.accountItems[0]

    expect(account.description).toBe(zhCN["setting.platform.common.yuque.desc"])
  })

  it("resets config flow state after a successful account configuration", async () => {
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!
    const legacyYuque = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Yuque-legacy",
      platformName: "语雀旧账号",
      isEnabled: true,
      isAuth: true,
      authMode: preset.authMode,
      isSys: false,
    } as DynamicConfig

    const settings = await mountHarness([legacyYuque])
    await settings.openAccountConfig(legacyYuque.platformKey, legacyYuque.platformName, "quick_publish")
    expect(settings.state.accountView).toBe("config")
    expect(settings.getConfigReturnTarget()).toBe("quick_publish")

    await settings.finishAccountConfig()

    expect(settings.state.accountView).toBe("list")
    expect(settings.getConfigReturnTarget()).toBeNull()
    expect(settings.state.pendingConfigItem).toBeNull()
    expect(settings.state.accountItems[0].platformKey).toBe(legacyYuque.platformKey)
  })
})
