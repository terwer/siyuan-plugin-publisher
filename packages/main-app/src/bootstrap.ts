import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { useAppInstance } from "./composables/useAppInstance"

interface BootstrapOptions {
  siyuanApp?: any
  mountElement?: HTMLElement
}

export const createBootstrap = (options: BootstrapOptions = {}) => {
  const { siyuanApp, mountElement } = options
  const vueApp = createApp(App)
  const { setAppContext } = useAppInstance()

  // 设置应用上下文
  setAppContext({
    vueApp,
    router,
    siyuanApp: siyuanApp || null,
    isSiYuan: !!siyuanApp,
  })

  // 使用路由
  vueApp.use(router)

  // 挂载应用
  const mountTarget = mountElement || document.getElementById("app")
  if (!mountTarget) {
    throw new Error("Mount element not found")
  }
  vueApp.mount(mountTarget)

  return vueApp
}

// 思源插件入口
export const createSiYuanBootstrap = (siyuanApp: any, mountElement: HTMLElement) => {
  return createBootstrap({
    siyuanApp,
    mountElement,
  })
}

// SPA 入口
export const createSPABootstrap = () => {
  return createBootstrap()
}
