/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { createAppLogger } from "@utils/appLogger.ts"
import { usePlugin } from "@/plugin/composables/usePlugin.ts"
import { BlogConfig, Post } from "zhi-blog-api"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { DeepReadonly } from "vue"
import { SypConfig } from "@/models/sypConfig.ts"
import { HookStage, PublishResult } from "@/plugin"
import { HookManager } from "@/plugin/hooks/manager.ts"
import { PluginLoaderManager } from "@/plugin/loader/manager"

/**
 * 发布相关的组合式函数
 *
 * @author terwer
 * @since 2.0.0
 * @version 2.0.0
 */
export const usePublish = () => {
  const logger = createAppLogger("use-publish")
  const { getPluginPath, loadPlugin, getPlugin } = usePlugin()
  const hookManager = HookManager.getInstance()
  const pluginLoader = PluginLoaderManager.getInstance()

  /**
   * 快速发布文章
   *
   * @param platformConfig 平台配置
   * @param post 文章内容
   * @param publishSetting 发布配置
   */
  const quickPublish = async (
    post: Post,
    platformConfig: DynamicConfig,
    publishSetting: DeepReadonly<SypConfig>,
  ): Promise<PublishResult> => {
    try {
      // 加载插件
      const pluginPath = getPluginPath(platformConfig)
      const result = await pluginLoader.loadPlugin(pluginPath)
      if (!result.success) {
        throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
      }

      // 获取插件实例
      const plugin = pluginLoader.getPlugin(platformConfig.platformKey)
      if (!plugin) {
        throw new Error(`Plugin not found: ${platformConfig.platformKey}`)
      }

      // 执行发布前的钩子
      const beforeProcessResult = await hookManager.executeHooks(HookStage.BEFORE_PROCESS, {
        id: platformConfig.platformKey,
        config: {
          platformConfig,
          blogConfig: (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {},
        },
        post,
        data: {},
      })
      if (!beforeProcessResult.success) {
        throw new Error(`Before process hook failed: ${beforeProcessResult.error?.message}`)
      }

      // 执行内容处理后的钩子
      const afterProcessResult = await hookManager.executeHooks(HookStage.AFTER_PROCESS, {
        id: platformConfig.platformKey,
        config: {
          platformConfig,
          blogConfig: (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {},
        },
        post: beforeProcessResult.data.post,
        data: beforeProcessResult.data.data,
      })
      if (!afterProcessResult.success) {
        throw new Error(`After process hook failed: ${afterProcessResult.error?.message}`)
      }

      // 执行发布前的钩子
      const beforePublishResult = await hookManager.executeHooks(HookStage.BEFORE_PUBLISH, {
        id: platformConfig.platformKey,
        config: {
          platformConfig,
          blogConfig: (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {},
        },
        post: afterProcessResult.data.post,
        data: afterProcessResult.data.data,
      })
      if (!beforePublishResult.success) {
        throw new Error(`Before publish hook failed: ${beforePublishResult.error?.message}`)
      }

      // 执行发布
      const postRes = await plugin.publish(beforePublishResult.data.post, {
        publishConfig: {
          platformConfig,
          blogConfig: (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {},
        },
      })
      if (!postRes.success) {
        const errorMsg = `Failed to publish post: ${postRes.error?.message}`
        logger.error(errorMsg)
        throw new Error(errorMsg)
      }

      // 执行发布后的钩子
      const afterPublishResult = await hookManager.executeHooks(HookStage.AFTER_PUBLISH, {
        id: platformConfig.platformKey,
        config: {
          platformConfig,
          blogConfig: (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {},
        },
        post: beforePublishResult.data.post,
        data: {
          postId: postRes.data,
          ...beforePublishResult.data.data,
        },
      })
      if (!afterPublishResult.success) {
        logger.warn(`After publish hook failed: ${afterPublishResult.error?.message}`)
      }

      const postId = postRes.data
      logger.info(`Post published successfully with ID: ${postId}`)
      return postRes
    } catch (e: any) {
      logger.error(`Quick publish failed: ${e}`)
      throw new Error(`Quick publish failed: ${e}`)
    }
  }

  /**
   * 普通发布文章
   *
   * @param platformConfig 平台配置
   * @param post 文章内容
   * @param publishSetting 发布配置
   * @returns 发布结果
   */
  const normalPublish = async (post: Post, platformConfig: DynamicConfig, publishSetting: DeepReadonly<SypConfig>) => {
    try {
      // 加载插件
      const pluginPath = getPluginPath(platformConfig)
      const result = await loadPlugin(pluginPath)
      if (result.error) {
        throw new Error(`Failed to load plugin from ${pluginPath}: ${result.error}`)
      }

      // 读取插件元数据
      const plugin = getPlugin(platformConfig.platformKey)
      if (!plugin) {
        throw new Error(`Plugin not found: ${platformConfig.platformKey}`)
      }

      // TODO: 实现普通发布逻辑
      return null
    } catch (e: any) {
      logger.error(`Normal publish failed: ${e}`)
      throw new Error(`Normal publish failed: ${e}`)
    }
  }

  return {
    quickPublish,
    normalPublish,
  }
}
