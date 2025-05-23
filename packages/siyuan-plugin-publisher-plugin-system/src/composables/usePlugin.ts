/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { ref } from "vue"
import { usePluginStore } from "@/stores/usePluginStore.ts"
import { IPluginConfig } from "siyuan-plugin-publisher-types"
import logger from "@/utils/logger.ts"

/**
 * 插件系统全局唯一入口
 */
export const usePlugin = () => {
  const pluginStore = usePluginStore()

  const loading = ref(false)

  /**
   * 获取当前活动的插件（内部使用）
   */
  const getActivePlugin = () => {
    const activeId = pluginStore.activePlugin
    return activeId ? pluginStore.getPlugin(activeId) : null
  }

  /**
   * 设置活动插件（内部使用）
   * @param pluginId 插件ID
   */
  const setActivePlugin = (pluginId: string) => {
    pluginStore.setActiveInstance(pluginId)
  }

  /**
   * 获取插件实例的唯一入口
   *
   * @param id 实例ID
   * @param templateId 模板ID，对应的是插件文件夹名称
   * @param config 插件配置
   * @author terwer
   * @version 2.0.0
   * @since 2.0.0
   */
  const getPlugin = async (id: string, templateId?: string, config?: Partial<IPluginConfig>) => {
    loading.value = true
    try {
      // 尝试获取已存在的插件
      let plugin = pluginStore.getPlugin(id)

      // 如果插件存在，直接返回
      if (plugin) {
        logger.info(`Plugin already exists: ${id}`)
        // 如果插件存在，设置为活动插件
        setActivePlugin(id)
        return plugin
      }

      // 如果插件不存在，尝试创建新实例
      // 检查模板是否存在
      if (!templateId) {
        throw new Error(`Template id is required for creating new plugin instance`)
      }

      let template = pluginStore.getTemplate(templateId)
      if (!template) {
        // 如果模板不存在，尝试加载模板
        try {
          template = await pluginStore.loadPluginTemplate(templateId)
          logger.info(`Loaded new template: ${templateId}`)
        } catch (error) {
          logger.error(`Failed to load template: ${templateId}`, error)
          throw new Error(`Template loading failed: ${templateId}`)
        }
      }

      if (!template) {
        throw new Error(`Template not found: ${templateId}`)
      }

      // 创建插件实例
      try {
        plugin = pluginStore.createPluginInstance(templateId, id, config)
        logger.info(`Created new plugin instance: ${id}`)
        // 新创建的插件设置为活动插件
        setActivePlugin(id)
      } catch (error) {
        logger.error(`Failed to create plugin instance: ${id}`, error)
        throw new Error(`Plugin instance creation failed: ${id}`)
      }

      return plugin
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取所有插件模板
   * 如果模板未加载，会自动扫描并加载所有模板
   */
  const getAllPluginTemplates = async () => {
    loading.value = true
    try {
      // 如果模板为空，尝试扫描并加载所有模板
      if (Object.keys(pluginStore.pluginTemplates).length === 0) {
        await pluginStore.scanAndLoadTemplates()
      }
      return pluginStore.pluginTemplates
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取所有插件实例
   */
  const getAllPlugins = () => {
    return pluginStore.plugins
  }

  /**
   * 更新插件配置
   * @param pluginId 插件ID
   * @param config 新的配置
   */
  const updatePluginConfig = (pluginId: string, config: Partial<IPluginConfig>) => {
    // 确保要更新的插件是当前活动插件
    const activePlugin = getActivePlugin()
    if (activePlugin && activePlugin.id === pluginId) {
      pluginStore.updatePluginConfig(pluginId, config)
    } else {
      logger.warn(`Cannot update config for non-active plugin: ${pluginId}`)
    }
  }

  /**
   * 删除插件实例
   * @param pluginId 插件ID
   */
  const deletePlugin = (pluginId: string) => {
    // 如果删除的是当前活动插件，需要清除活动状态
    const activePlugin = getActivePlugin()
    if (activePlugin && activePlugin.id === pluginId) {
      pluginStore.setActiveInstance(null as any)
    }
    pluginStore.deletePlugin(pluginId)
  }

  return {
    loading,
    getPlugin,
    getAllPlugins,
    getAllPluginTemplates,
    updatePluginConfig,
    deletePlugin,
  }
}
