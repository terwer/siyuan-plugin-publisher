/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { beforeEach, describe, it } from "vitest"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { config, mount } from "@vue/test-utils"
import App from "~/src/App.vue"
import { createVueApp } from "~/src/bootstrap.ts"

describe("test usePublishConfig", async () => {
  const instance = await createVueApp()
  const app = instance.app

  beforeEach(async () => {
    // apply plugins
    config.global.plugins = [instance.i18n, instance.router]

    // mock env
    process.env.VITE_DEFAULT_TYPE = "siyuan"
    process.env.VITE_SIYUAN_API_URL = "http://127.0.0.1:6806"
    process.env.VITE_SIYUAN_AUTH_TOKEN = ""
    process.env.VITE_DEV_PAGE_ID = "20230731201306-ps6ld6p"
    // 等价于访问首页: http://localhost:5173/#/?id=20230731201306-ps6ld6p

    const wrapper = mount(App)
    console.log(wrapper.html())
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
