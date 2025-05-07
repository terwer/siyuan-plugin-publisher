/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createApp } from "vue"
import Publish from "@pages/publish/Index.vue"
import { createPinia } from "pinia"

// export const APP_INJECT_KEY: InjectionKey<any> = Symbol("app")

const createBootStrap = (props: any, container: string | HTMLElement) => {
  const app = createApp(Publish, props)
  const pinia = createPinia()

  app.use(pinia)
  app.mount(container)

  // 核心注入逻辑
  // app.provide(APP_INJECT_KEY, app)
  return app
}

export { createBootStrap }
