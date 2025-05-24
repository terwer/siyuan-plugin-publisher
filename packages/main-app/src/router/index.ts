import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"
import Home from "../views/Home.vue"
import Settings from "../views/Settings.vue"
import Publish from "../views/Publish.vue"
import NotFound from "../views/NotFound.vue"
import UITest from "../views/UITest.vue"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      title: "设置",
    },
  },
  {
    path: "/publish",
    name: "Publish",
    component: Publish,
    meta: {
      title: "发布",
    },
  },
  {
    path: "/ui-test",
    name: "UITest",
    component: UITest,
    meta: {
      title: "UI 组件测试",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "页面未找到",
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title} - 思源笔记发布插件`
  next()
})

// 错误处理
router.onError((error) => {
  console.error("路由错误:", error)
})

export default router
