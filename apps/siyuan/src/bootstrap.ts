/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import AppIndex from "@pages/Index.vue"
import Publish from "@pages/publish/Index.vue"
import AccountSetting from "@pages/setting/AccountSetting.vue"
import DashBoard from "@pages/setting/DashBoard.vue"
import GeneralSetting from "@pages/setting/GeneralSetting.vue"
import SinglePlatformSetting from "@pages/setting/account/single/Index.vue"
import { createPinia } from "pinia"
import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"

function createAppRoutes(props: any) {
  // 定义路由
  const routes = [
    { path: "/", component: Publish, props: props },
    { path: "/dashboard", component: DashBoard, props: props },
    { path: "/setting/general", component: GeneralSetting, props: props },
    { path: "/setting/account", component: AccountSetting, props: props },
    {
      path: "/setting/account/single/:key",
      component: SinglePlatformSetting,
      props: props,
    },
  ]
  return routes
}

const createBootStrap = (props: any, container: string | HTMLElement) => {
  const app = createApp(AppIndex, props)
  const pinia = createPinia()
  const routes = createAppRoutes(props)
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(pinia)
  app.use(router)
  app.mount(container)

  return app
}

export { createBootStrap }
