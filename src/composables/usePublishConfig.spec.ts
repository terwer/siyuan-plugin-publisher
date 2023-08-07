/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { beforeEach, describe, it } from "vitest"
import { usePublishConfig } from "~/src/composables/usePublishConfig.ts"
import { config, mount } from "@vue/test-utils"
import App from "~/src/App.vue"
import { createVueApp } from "~/src/utils/VueUtils.ts"
import { InjectKeys } from "~/src/utils/injectKeys.ts"

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
    // 暴露 Vue 实例
    app.provide(InjectKeys.VUE_INSTANCE, app)
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
