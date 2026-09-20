/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, it } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { createI18n } from "vue-i18n"
import { config } from "@vue/test-utils"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"

/**
 * `usePublishConfig` 的冒烟测试。
 *
 * 原先用挂载 V1 的 `App.vue`（`createVueApp()`）来准备 i18n/router/pinia 上下文；V1 退役后该壳已删除，
 * 而这组用例真正要覆盖的是「配置能否解析出版本与适配器」，故改为直接准备 pinia 与 i18n，
 * 不再挂载任何 SPA 组件。
 */
describe("test usePublishConfig", async () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    config.global.plugins = [createI18n({ legacy: false, locale: "zh_CN", messages: { zh_CN: {} } })]

    // mock env
    process.env.VITE_DEFAULT_TYPE = "siyuan"
    process.env.VITE_SIYUAN_API_URL = "http://127.0.0.1:6806"
    process.env.VITE_SIYUAN_AUTH_TOKEN = ""
    process.env.VITE_DEV_PAGE_ID = "20230731201306-ps6ld6p"
  })

  it("test getPublishCfg", async () => {
    const key = "github_Hexo"
    const { getPublishCfg } = usePublishConfig()

    const publishCfg = await getPublishCfg(key)
    console.log("publishCfg =>", publishCfg)
  })

  it("test getPublishApi", async () => {
    const key = "github_Hexo"
    const { getPublishCfg, getPublishApi } = usePublishConfig()

    const publishCfg = await getPublishCfg(key)
    const api = await getPublishApi(key, publishCfg.cfg)
    console.log("api =>", api)
  })
})
