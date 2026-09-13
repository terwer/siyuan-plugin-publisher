/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { flushPromises, mount } from "@vue/test-utils"
import { createI18n } from "vue-i18n"
import { defineComponent } from "vue"
import { describe, expect, it, vi } from "vitest"
import { PasswordType } from "zhi-blog-api"
import BilibiliSetting from "~/src/components/set/publish/singleplatform/web/BilibiliSetting.vue"
import CsdnSetting from "~/src/components/set/publish/singleplatform/web/CsdnSetting.vue"
import HalowebSetting from "~/src/components/set/publish/singleplatform/web/HalowebSetting.vue"
import JianshuSetting from "~/src/components/set/publish/singleplatform/web/JianshuSetting.vue"
import JuejinSetting from "~/src/components/set/publish/singleplatform/web/JuejinSetting.vue"
import WechatSetting from "~/src/components/set/publish/singleplatform/web/WechatSetting.vue"
import YuquewebSetting from "~/src/components/set/publish/singleplatform/web/YuquewebSetting.vue"
import ZhihuSetting from "~/src/components/set/publish/singleplatform/web/ZhihuSetting.vue"
import { pre } from "~/src/platforms/pre.ts"
import { AuthMode, PlatformType, SubPlatformType } from "~/src/platforms/dynamicConfig.ts"
import zhCN from "~/siyuan/i18n/zh_CN.json"

const bridgeSlotPayload = vi.hoisted(() => ({
  dynCfg: {
    platformType: "Custom",
    subPlatformType: "Zhihu",
    platformKey: "custom_Zhihu",
    platformName: "知乎",
    authMode: "web",
    isEnabled: true,
    isAuth: false,
    isSys: false,
  },
  setting: {},
  dynamicConfigArray: [] as any[],
  toggleManualEditor: vi.fn(),
  expandManualEditor: vi.fn(),
}))

const createCfg = vi.hoisted(
  () => (platformKey?: string) =>
    ({
      platformKey,
      passwordType: 2,
      password: "",
      metadata: {},
      placeholder: {},
      homeEnabled: false,
      apiUrlEnabled: false,
      usernameEnabled: false,
      previewUrlEnabled: false,
      knowledgeSpaceEnabled: false,
    }) as any
)

const mockUseBilibiliWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseCsdnWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseHalowebWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseJianshuWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseJuejinWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseWechatWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseYuquewebWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))
const mockUseZhihuWeb = vi.hoisted(() => vi.fn(async (key?: string) => ({ cfg: createCfg(key) })))

vi.mock("~/src/components/set/publish/singleplatform/base/impl/CustomWebSetting.vue", () => ({
  default: {
    name: "CustomWebSetting",
    props: ["apiType", "cfg", "enableOnValidated"],
    emits: ["validated", "saved"],
    template: `
      <div
        class="custom-web-setting-stub"
        :data-api-type="apiType"
        :data-enable-on-validated="enableOnValidated === true ? 'true' : 'false'"
      >
        <button class="emit-validated" type="button" @click="$emit('validated', { ok: true, apiStatus: true })">validate</button>
        <button class="emit-saved" type="button" @click="$emit('saved', { ok: true })">save</button>
        <slot
          name="cookie-actions"
          :cfg="cfg"
          :dyn-cfg="payload.dynCfg"
          :setting="payload.setting"
          :dynamic-config-array="payload.dynamicConfigArray"
          :is-manual-expanded="false"
          :toggle-manual-editor="payload.toggleManualEditor"
          :expand-manual-editor="payload.expandManualEditor"
        />
      </div>
    `,
    setup() {
      return { payload: bridgeSlotPayload }
    },
  },
}))

vi.mock("~/src/adaptors/web/bilibili/useBilibiliWeb.ts", () => ({ useBilibiliWeb: mockUseBilibiliWeb }))
vi.mock("~/src/adaptors/web/csdn/useCsdnWeb.ts", () => ({ useCsdnWeb: mockUseCsdnWeb }))
vi.mock("~/src/adaptors/web/haloweb/useHalowebWeb.ts", () => ({ useHalowebWeb: mockUseHalowebWeb }))
vi.mock("~/src/adaptors/web/jianshu/useJianshuWeb.ts", () => ({ useJianshuWeb: mockUseJianshuWeb }))
vi.mock("~/src/adaptors/web/juejin/useJuejinWeb.ts", () => ({ useJuejinWeb: mockUseJuejinWeb }))
vi.mock("~/src/adaptors/web/wechat/useWechatWeb.ts", () => ({ useWechatWeb: mockUseWechatWeb }))
vi.mock("~/src/adaptors/web/yuqueweb/useYuquewebWeb.ts", () => ({ useYuquewebWeb: mockUseYuquewebWeb }))
vi.mock("~/src/adaptors/web/zhihu/useZhihuWeb.ts", () => ({ useZhihuWeb: mockUseZhihuWeb }))

const WEB_SETTING_COMPONENTS_BY_SUBTYPE = {
  [SubPlatformType.Custom_Zhihu]: ZhihuSetting,
  [SubPlatformType.Custom_CSDN]: CsdnSetting,
  [SubPlatformType.Custom_Wechat]: WechatSetting,
  [SubPlatformType.Custom_Jianshu]: JianshuSetting,
  [SubPlatformType.Custom_Juejin]: JuejinSetting,
  [SubPlatformType.Custom_Haloweb]: HalowebSetting,
  [SubPlatformType.Custom_Yuqueweb]: YuquewebSetting,
  [SubPlatformType.Custom_Bilibili]: BilibiliSetting,
}

const mountWebSetting = async (component: any, platformKey: string) => {
  const onValidated = vi.fn()
  const onSaved = vi.fn()
  const Harness = defineComponent({
    components: {
      Target: component,
    },
    setup() {
      return { onValidated, onSaved, platformKey }
    },
    template: `
      <Suspense>
        <Target
          :api-type="platformKey"
          :enable-on-validated="true"
          @validated="onValidated"
          @saved="onSaved"
        >
          <template #cookie-actions="slotProps">
            <div
              class="cookie-actions-slot"
              :data-platform-key="slotProps.cfg.platformKey"
              :data-dyn-platform-key="slotProps.dynCfg.platformKey"
            >
              <button class="toggle-cookie" type="button" @click="slotProps.toggleManualEditor()">toggle</button>
            </div>
          </template>
        </Target>
      </Suspense>
    `,
  })

  const wrapper = mount(Harness, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale: "zh_CN",
          messages: { zh_CN: zhCN },
        }),
      ],
    },
  })
  await flushPromises()
  return { wrapper, onValidated, onSaved }
}

describe("web Cookie bridge slot forwarding", () => {
  it("covers every enabled custom web Cookie preset with a web Setting component", () => {
    const enabledCustomWebSubtypes = pre.customCfg
      .filter((item) => item.authMode === AuthMode.WEBSITE)
      .map((item) => item.subPlatformType)
      .sort()

    expect(Object.keys(WEB_SETTING_COMPONENTS_BY_SUBTYPE).sort()).toEqual(enabledCustomWebSubtypes)
    expect(enabledCustomWebSubtypes).toEqual(
      expect.arrayContaining([SubPlatformType.Custom_CSDN, SubPlatformType.Custom_Zhihu])
    )
  })

  it.each(pre.customCfg.filter((item) => item.platformType === PlatformType.Custom && item.authMode === AuthMode.WEBSITE))(
    "forwards cookie-actions slot through $platformKey",
    async (platform) => {
      const component = WEB_SETTING_COMPONENTS_BY_SUBTYPE[platform.subPlatformType!]
      const { wrapper, onValidated, onSaved } = await mountWebSetting(component, platform.platformKey)

      const stub = wrapper.find(".custom-web-setting-stub")
      expect(stub.exists()).toBe(true)
      expect(stub.attributes("data-api-type")).toBe(platform.platformKey)
      expect(stub.attributes("data-enable-on-validated")).toBe("true")

      const slot = wrapper.find(".cookie-actions-slot")
      expect(slot.exists()).toBe(true)
      expect(slot.attributes("data-platform-key")).toBe(platform.platformKey)
      expect(slot.attributes("data-dyn-platform-key")).toBe("custom_Zhihu")

      await wrapper.find(".toggle-cookie").trigger("click")
      expect(bridgeSlotPayload.toggleManualEditor).toHaveBeenCalled()

      await wrapper.find(".emit-validated").trigger("click")
      expect(onValidated).toHaveBeenCalledWith({ ok: true, apiStatus: true })

      await wrapper.find(".emit-saved").trigger("click")
      expect(onSaved).toHaveBeenCalledWith({ ok: true })
    }
  )

  it("keeps forwarded Cookie configs recognizable as web Cookie configs", async () => {
    const { wrapper } = await mountWebSetting(CsdnSetting, "custom_Csdn")
    expect(wrapper.find(".cookie-actions-slot").exists()).toBe(true)
    expect(createCfg("custom_Csdn").passwordType).toBe(PasswordType.PasswordType_Cookie)
  })
})
