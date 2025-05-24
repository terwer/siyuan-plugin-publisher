import { createApp, type App } from "vue"
import AppComponent from "./App.vue"
import router from "./router"
import type { Plugin } from "siyuan"

/**
 * 创建全局唯一的 Vue App 实例
 *
 * @param props - 包含 appInstance 的属性对象
 * @param el - 挂载点元素
 * @returns Vue App 实例
 * @author terwer
 * @version 2.0.0
 * @since 0.0.1
 */
export const createBootStrap = (props: { appInstance: Plugin | null }, el: HTMLElement): App => {
  // 创建 Vue 应用实例
  const app = createApp(AppComponent, props)

  // 使用路由
  app.use(router)

  // 挂载到指定元素
  app.mount(el)

  return app
}
