/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { TabEnum } from "@enums/TabEnum.ts"
import AppIndex from "@pages/Index.vue"
import Publish from "@pages/publish/Index.vue"
import AccountSetting from "@pages/setting/AccountSetting.vue"
import DashBoard from "@pages/setting/DashBoard.vue"
import GeneralSetting from "@pages/setting/GeneralSetting.vue"
import AddPlatform from "@pages/setting/account/manage/AddPlatform.vue"
import PlatformTemplateList from "@pages/setting/account/manage/PlatformTemplateList.vue"
import SinglePlatformSetting from "@pages/setting/account/single/Index.vue"
import { createPinia } from "pinia"
import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"

/**
 * 创建路由
 *
 * @author terwer
 * @version 1.0.0
 * @since 0.0.1
 */
let tabSwitchRouter: any = null
const createAppRoutes = (props: any) => {
  // 定义路由
  const routes = [
    {
      path: "/",
      component: Publish,
      props: {
        ...props,
        requestSwitchTab: (componentType: TabEnum) => {
          if (!tabSwitchRouter) {
            console.warn("Tab switch router not initialized")
            return
          }
          switch (componentType) {
            case TabEnum.ACCOUNT:
              tabSwitchRouter.push("/setting/account")
              break
            case TabEnum.DASHBOARD:
              tabSwitchRouter.push("/dashboard")
              break
            case TabEnum.PREFERENCE:
              tabSwitchRouter.push("/setting/general")
              break
            default:
              tabSwitchRouter.push("/")
          }
        },
      },
    },
    { path: "/dashboard", component: DashBoard, props: props },
    { path: "/setting/general", component: GeneralSetting, props: props },
    { path: "/setting/account", component: AccountSetting, props: props },
    {
      path: "/setting/account/single/:key",
      component: SinglePlatformSetting,
      props: props,
    },
    {
      path: "/setting/account/templates",
      component: PlatformTemplateList,
      props: props,
    },
    {
      path: "/setting/account/add/:templateKey",
      component: AddPlatform,
      props: props,
    },
  ]
  return routes
}

/**
 * 创建全局唯一的 Vue App 实例
 *
 * @param props
 * @param el
 * @author terwer
 * @version 2.0.0
 * @since 0.0.1
 */
export const createBootStrap = (props: any, el: HTMLElement) => {
  const app = createApp(AppIndex)
  const pinia = createPinia()
  app.use(pinia)

  const routes = createAppRoutes(props)
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  // 添加导航守卫，第一次访问时重定向到根路径
  let isFirstVisit = true
  router.beforeEach((_to, _from, next) => {
    if (isFirstVisit) {
      isFirstVisit = false
      next("/")
    } else {
      next()
    }
  })

  tabSwitchRouter = router
  app.use(router)

  app.mount(el)
  return app
}
