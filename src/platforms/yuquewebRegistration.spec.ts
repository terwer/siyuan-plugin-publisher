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
})
