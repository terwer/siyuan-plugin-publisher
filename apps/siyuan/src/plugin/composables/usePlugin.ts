/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ref } from "vue"
import { PluginLoaderManager } from "@/plugin/loader/manager.ts"
import { IPlugin } from "@/plugin"
import { createAppLogger } from "@utils/appLogger.ts"
import { HookManager } from "@/plugin"
import { HookStage } from "@/plugin"
import { beforeProcessHook, beforePublishHook } from "@/plugin"

const logger = createAppLogger("use-plugin")

export const usePlugin = () => {
  const loader = PluginLoaderManager.getInstance()
  const hookManager = HookManager.getInstance()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 初始化全局 Hook
  const initGlobalHooks = () => {
    hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, beforeProcessHook)
    hookManager.registerGlobalHook(HookStage.BEFORE_PUBLISH, beforePublishHook)
  }

  const loadAllPlugins = async (pluginPaths: string) => {
    for (const path of pluginPaths) {
      try {
        await loadPlugin(path)
      } catch (e) {
        logger.error(`Error loading plugin ${path}:`, e)
      }
    }
  }

  const loadPlugin = async (pluginPath: string) => {
    loading.value = true
    error.value = null

    try {
      await loader.loadPlugin(pluginPath)
      logger.info(`Plugin loaded successfully: ${pluginPath}`)
    } catch (e: any) {
      error.value = e.message
      logger.error(`Failed to load plugin: ${e.message}`)
      throw e
    } finally {
      loading.value = false
    }
  }

  const getPlugin = (platform: string) => {
    return loader.getPlugin(platform)
  }

  const getAllPlugins = () => {
    return loader.getAllPlugins()
  }

  // 初始化
  initGlobalHooks()

  return {
    loading,
    error,
    loadPlugin,
    getPlugin,
    loadAllPlugins,
    getAllPlugins,
  }
}
