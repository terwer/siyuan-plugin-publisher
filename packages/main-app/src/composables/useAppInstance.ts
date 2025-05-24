import { ref } from "vue"
import type { App } from "vue"
import type { Router } from "vue-router"
import type { Plugin } from "siyuan"

export interface SiYuanApp extends Plugin {}

export interface AppContext {
  vueApp: App
  router: Router
  siyuanApp: SiYuanApp | null
  isSiYuan: boolean
  // 可以添加更多应用相关的上下文
}

const appContext = ref<AppContext | null>(null)

export const useAppInstance = () => {
  const setAppContext = (context: AppContext) => {
    appContext.value = context
  }

  const getAppContext = () => {
    if (!appContext.value) {
      throw new Error("App context not initialized")
    }
    return appContext.value
  }

  const getVueApp = () => {
    return getAppContext().vueApp
  }

  const getRouter = () => {
    return getAppContext().router
  }

  const getSiYuanApp = () => {
    const context = getAppContext()
    if (!context.siyuanApp) {
      throw new Error("SiYuan app instance not available")
    }
    return context.siyuanApp
  }

  const isSiYuan = () => {
    return getAppContext().isSiYuan
  }

  // 可以添加更多获取应用相关实例的方法

  return {
    setAppContext,
    getAppContext,
    getVueApp,
    getRouter,
    getSiYuanApp,
    isSiYuan,
  }
}
