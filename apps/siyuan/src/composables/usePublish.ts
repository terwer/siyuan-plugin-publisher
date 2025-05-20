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
import { PublishResult } from "@/plugin"

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
      // const pluginPath = "wordpress/index.js"
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

      // 执行发布
      const blogConfig = (publishSetting as Record<string, BlogConfig>)[platformConfig.platformKey] ?? {}
      const postRes = await plugin.publish(post, {
        publishConfig: {
          platformConfig,
          blogConfig: blogConfig,
        },
      })
      if (!postRes.success) {
        const errorMsg = `Failed to publish post: ${postRes.error?.message}`
        logger.error(errorMsg)
        throw new Error(errorMsg)
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
