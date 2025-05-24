import { createRouter, createWebHashHistory } from "vue-router"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/test"
    },
    {
      path: "/test",
      component: () => import("../test/index.vue"),
      children: [
        {
          path: "",
          redirect: "/test/button"
        },
        {
          path: "button",
          component: () => import("../test/ButtonTest.vue")
        },
        {
          path: "form",
          component: () => import("../test/FormTest.vue")
        },
        {
          path: "tab",
          component: () => import("../test/TabTest.vue")
        },
        {
          path: "setting-panel",
          component: () => import("../test/SettingPanelTest.vue")
        }
      ]
    }
  ]
})

export default router
