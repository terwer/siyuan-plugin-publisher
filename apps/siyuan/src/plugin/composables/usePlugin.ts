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
import { StrUtil } from "zhi-common"
import { legencyPlatformMap } from "@/presets/platformTemplates.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"

const logger = createAppLogger("use-plugin")

export const usePlugin = () => {
  const loader = PluginLoaderManager.getInstance()
  const hookManager = HookManager.getInstance()
  const loading = ref(false)

  // 初始化全局 Hook
  const initGlobalHooks = () => {
    hookManager.registerGlobalHook(HookStage.BEFORE_PROCESS, beforeProcessHook)
    hookManager.registerGlobalHook(HookStage.BEFORE_PUBLISH, beforePublishHook)
  }

  const loadAllPlugins = async (pluginPaths: string) => {
    loading.value = true
    for (const path of pluginPaths) {
      try {
        await loadPlugin(path)
      } catch (e) {
        logger.error(`Error loading plugin ${path}:`, e)
      }
    }
    loading.value = false
  }

  const getPluginPath = (platformConfig: DynamicConfig): string => {
    const pluginPath = StrUtil.isEmptyString(platformConfig.pluginPath)
      ? (legencyPlatformMap.get(platformConfig.subPlatformType) as string)
      : platformConfig.pluginPath
    return pluginPath ?? "unknown"
  }

  const loadPlugin = async (pluginPath: string) => {
    loading.value = true
    const result = await loader.loadPlugin(pluginPath)
    logger.info(`Plugin loaded successfully: ${pluginPath}`)
    loading.value = false
    return result
  }

  const getPlugin = (id: string) => {
    return loader.getPlugin(id)
  }

  const getAllPlugins = () => {
    return loader.getAllPlugins()
  }

  // 初始化
  initGlobalHooks()

  return {
    loading,
    getPluginPath,
    loadPlugin,
    getPlugin,
    loadAllPlugins,
    getAllPlugins,
  }
}
