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
    store.updateSetting = vi.fn().mockImplementation(async (nextSetting: any) => {
      Object.assign(setting, nextSetting)
    })

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
    return {
      settings: exposed!,
      setting,
      store,
    }
  }

  it("builds selectable platforms from pre.ts i18n field mappings", async () => {
    const { settings } = await mountHarness([])
    const yuque = settings.selectablePlatforms.value.find((item) => item.platformKey === "common_Yuque")
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!

    expect(preset.description).toBeUndefined()
    expect(yuque?.description).toBe(zhCN[preset.i18n!.description])
  })

  it("exposes every enabled custom web preset in the V2 bridge selector", async () => {
    const { settings } = await mountHarness([])
    const selectableCustomKeys = settings.selectablePlatforms.value
      .filter((item) => item.platformType === PlatformType.Custom)
      .map((item) => item.platformKey)

    expect(selectableCustomKeys).toEqual(expect.arrayContaining(pre.customCfg.map((item) => item.platformKey)))
    expect(selectableCustomKeys).toContain("custom_Zhihu")
    expect(selectableCustomKeys).toContain("custom_Csdn")
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

    const { settings } = await mountHarness([legacyYuque])
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

    const { settings } = await mountHarness([legacyYuque])
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

    const { settings } = await mountHarness([legacyYuque])
    await settings.openAccountConfig(legacyYuque.platformKey, legacyYuque.platformName, "quick_publish")
    expect(settings.state.accountView).toBe("config")
    expect(settings.getConfigReturnTarget()).toBe("quick_publish")

    await settings.finishAccountConfig()

    expect(settings.state.accountView).toBe("list")
    expect(settings.getConfigReturnTarget()).toBeNull()
    expect(settings.state.pendingConfigItem).toBeNull()
    expect(settings.state.accountItems[0].platformKey).toBe(legacyYuque.platformKey)
  })

  it("sorts account items with enabled accounts first and displayOrder inside each group", async () => {
    const disabledEarly = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_DisabledEarly",
      platformName: "禁用靠前",
      isEnabled: false,
      isAuth: false,
      displayOrder: 0,
      authMode: pre.commonCfg[0].authMode,
      isSys: false,
    } as DynamicConfig
    const enabledLate = {
      ...disabledEarly,
      platformKey: "common_EnabledLate",
      platformName: "启用靠后",
      isEnabled: true,
      isAuth: true,
      displayOrder: 20,
    } as DynamicConfig
    const enabledEarly = {
      ...disabledEarly,
      platformKey: "common_EnabledEarly",
      platformName: "启用靠前",
      isEnabled: true,
      isAuth: true,
      displayOrder: 5,
    } as DynamicConfig

    const { settings } = await mountHarness([disabledEarly, enabledLate, enabledEarly])

    expect(settings.state.accountItems.map((item) => item.platformKey)).toEqual([
      "common_EnabledEarly",
      "common_EnabledLate",
      "common_DisabledEarly",
    ])
  })

  it("persists reordered displayOrder without changing auth or enablement fields", async () => {
    const first = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_First",
      platformName: "第一个",
      isEnabled: true,
      isAuth: true,
      displayOrder: 0,
      authMode: pre.commonCfg[0].authMode,
      isSys: false,
    } as DynamicConfig
    const second = {
      ...first,
      platformKey: "common_Second",
      platformName: "第二个",
      isEnabled: false,
      isAuth: false,
      displayOrder: 1,
    } as DynamicConfig

    const { settings, setting, store } = await mountHarness([first, second])

    await settings.reorderAccounts(["common_Second", "common_First"])

    const stored = JSON.parse(JSON.stringify(setting[DYNAMIC_CONFIG_KEY])) as ReturnType<typeof setDynamicJsonCfg>
    expect(stored.totalCfg.map((item) => [item.platformKey, item.displayOrder])).toEqual([
      ["common_Second", 0],
      ["common_First", 1],
    ])
    expect(stored.totalCfg.find((item) => item.platformKey === "common_First")?.isAuth).toBe(true)
    expect(stored.totalCfg.find((item) => item.platformKey === "common_Second")?.isEnabled).toBe(false)
    expect(store.updateSetting).toHaveBeenCalled()
  })

  it("keeps displayOrder when toggling enablement so the account moves by group only", async () => {
    const enabled = {
      platformType: PlatformType.Common,
      subPlatformType: SubPlatformType.Common_Yuque,
      platformKey: "common_Enabled",
      platformName: "启用账号",
      isEnabled: true,
      isAuth: true,
      displayOrder: 2,
      authMode: pre.commonCfg[0].authMode,
      isSys: false,
    } as DynamicConfig
    const disabled = {
      ...enabled,
      platformKey: "common_Disabled",
      platformName: "禁用账号",
      isEnabled: false,
      isAuth: false,
      displayOrder: 0,
    } as DynamicConfig

    const { settings, setting } = await mountHarness([enabled, disabled])

    await settings.toggleAccountEnabled("common_Disabled", true)

    const stored = setting[DYNAMIC_CONFIG_KEY].totalCfg as DynamicConfig[]
    expect(stored.find((item) => item.platformKey === "common_Disabled")?.displayOrder).toBe(0)
    expect(settings.state.accountItems.map((item) => item.platformKey)).toEqual([
      "common_Disabled",
      "common_Enabled",
    ])
  })

  it("assigns a new account to the next displayOrder and removes deleted account order with the account", async () => {
    const preset = pre.commonCfg.find((item) => item.platformKey === "common_Yuque")!
    const existing = {
      ...preset,
      platformKey: preset.platformKey,
      platformName: preset.platformName,
      isEnabled: true,
      isAuth: true,
      displayOrder: 7,
      isSys: false,
    } as DynamicConfig

    const { settings, setting } = await mountHarness([existing])

    await settings.createAccountDraft({
      key: preset.platformKey,
      platformKey: preset.platformKey,
      platformName: preset.platformName,
      description: "",
      platformIcon: preset.platformIcon,
      platformType: preset.platformType,
      subPlatformType: preset.subPlatformType!,
    })

    let stored = setting[DYNAMIC_CONFIG_KEY].totalCfg as DynamicConfig[]
    const created = stored.find((item) => item.platformKey !== preset.platformKey)!
    expect(created.displayOrder).toBe(8)
    expect(created.isEnabled).toBe(false)

    await settings.phase4DeleteDraft(created.platformKey)

    stored = setting[DYNAMIC_CONFIG_KEY].totalCfg as DynamicConfig[]
    expect(stored.map((item) => item.platformKey)).toEqual([preset.platformKey])
  })
})
