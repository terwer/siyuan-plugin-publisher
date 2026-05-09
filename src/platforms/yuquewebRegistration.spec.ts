/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { describe, expect, it } from "vitest"
import { PRE_CONSTANTS } from "~/src/platforms/PreConstants.ts"
import { AuthMode, getSubPlatformTypeByKey, getSubtypeList, PlatformType, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import { pre } from "~/src/platforms/pre.ts"
import { getV2BridgeComponent, SUPPORTED_V2_BRIDGE_SUBTYPES } from "~/src/components/v2/settings/bridge/bridgeRegistry.ts"
import { V2_PLATFORM_SELECT_GROUP_DEFS } from "~/src/components/v2/settings/v2PlatformSelectGroups.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"
import enUS from "~/siyuan/i18n/en_US.json"

describe("yuqueweb platform registration", () => {
  it("registers custom_Yuqueweb as an independent custom web platform", () => {
    expect(PRE_CONSTANTS.PRE_CUSTOM_YUQUEWEB).toBe("custom_Yuqueweb")
    expect(getSubPlatformTypeByKey("custom_Yuqueweb")).toBe(SubPlatformType.Custom_Yuqueweb)
    expect(getSubtypeList(PlatformType.Custom)).toContain(SubPlatformType.Custom_Yuqueweb)

    const platform = pre.customCfg.find((item) => item.platformKey === PRE_CONSTANTS.PRE_CUSTOM_YUQUEWEB)
    expect(platform?.subPlatformType).toBe(SubPlatformType.Custom_Yuqueweb)
    expect(platform?.authMode).toBe(AuthMode.WEBSITE)
    expect(platform?.authUrl).toBe("https://www.yuque.com/login")
    expect(platform?.domain).toBe("yuque.com")
  })

  it("registers V2 bridge component", () => {
    expect(SUPPORTED_V2_BRIDGE_SUBTYPES.has(SubPlatformType.Custom_Yuqueweb)).toBe(true)
    expect(getV2BridgeComponent(SubPlatformType.Custom_Yuqueweb)).toBeTruthy()
  })

  it("keeps custom web platforms visible in the V2 add-account platform selector", () => {
    const visibleGroups = V2_PLATFORM_SELECT_GROUP_DEFS.map((group) => group.key)

    expect(visibleGroups).toContain(PlatformType.Custom)
  })

  it("provides V2 i18n labels for the custom web platform group", () => {
    expect(zhCN["setting.platform.custom"]).toBeTruthy()
    expect(enUS["setting.platform.custom"]).toBeTruthy()
  })

  it("stores Yuque web description i18n mapping on the platform preset itself", () => {
    const platform = pre.customCfg.find((item) => item.platformKey === PRE_CONSTANTS.PRE_CUSTOM_YUQUEWEB)
    const zhDescription = zhCN[platform!.i18n!.description]
    const enDescription = enUS[platform!.i18n!.description]

    expect(platform?.description).toBeUndefined()
    expect(platform?.i18n?.description).toBe("setting.platform.custom.yuqueweb.desc")
    expect(zhDescription).toContain("语雀知识库")
    expect(zhDescription).toContain("沉淀文档")
    expect(zhDescription).not.toContain(["网页", " Cookie ", "授权"].join(""))
    expect(enDescription).toContain("Yuque knowledge bases")
    expect(enDescription).not.toContain(["web", "Cookie", "authorization"].join(" "))
  })
})
