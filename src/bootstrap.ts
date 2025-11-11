/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createApp } from "vue"
import App from "./App.vue"
import { createAppLogger } from "./utils/appLogger.ts"
import { useVueRouter } from "./composables/useVueRouter.ts"
import i18n from "./locales"
import { createPinia } from "pinia"
import iframeResize from "./utils/directives/iframeResize.ts";

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

  // ifreme resizere
  app.directive('resize', iframeResize)

  return { i18n, router, app }
}

export { createVueApp }
