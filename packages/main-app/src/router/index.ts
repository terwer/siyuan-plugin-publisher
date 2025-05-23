import { createRouter, createWebHashHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      title: "设置",
    },
  },
  {
    path: "/publish",
    name: "Publish",
    component: () => import("../views/Publish.vue"),
    meta: {
      title: "发布",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
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
