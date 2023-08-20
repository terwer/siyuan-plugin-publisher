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

import { createApp } from "vue"
import App from "~/src/App.vue"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useVueRouter } from "~/src/composables/useVueRouter.ts"
import i18n from "~/src/locales"
import { createPinia } from "pinia"

/**
 * Vue 入口
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.0.1
 */
const createVueApp = async (isMount?: boolean) => {
  const logger = createAppLogger("vue-main-entry")

  // https://stackoverflow.com/a/62383325/4037224
  const app = createApp(App)

  // 国际化
  app.use(i18n)

  // pinia
  const pinia = createPinia()
  app.use(pinia)

  // router
  const router = useVueRouter()
  app.use(router)

  // ElementPlus 包太大，需要改成按需引入
  // https://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5
  // app.use(ElementPlus)

  return { i18n, router, app }
}

export { createVueApp }
