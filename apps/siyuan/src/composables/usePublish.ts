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
import { BLOG_CONFIG_KEY } from "@/Constants.ts"
import * as _ from "lodash-es"

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

  const getBlogConfig = <T>(setting: DeepReadonly<SypConfig>, platformKey: string, legency: boolean): T => {
    if (legency) {
      const configMap = (setting as any)[platformKey]
      if (!configMap || typeof configMap !== "object") {
        return {} as T
      }
      return configMap as T
    } else {
      const configMap = (setting as any)[BLOG_CONFIG_KEY]
      if (!configMap || typeof configMap !== "object") {
        return {} as T
      }
      return ((configMap as Record<string, T>)[platformKey] ?? {}) as T
    }
  }

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

      // 解析相关配置
      const legencyBlogConfig = getBlogConfig<BlogConfig>(publishSetting, platformConfig.platformKey, true)
      const blogConfig = {} as Record<string, any>
      const dbBlogConfig = getBlogConfig<Record<string, any>>(publishSetting, platformConfig.platformKey, false)
      _.merge(blogConfig, plugin.defaultConfig, dbBlogConfig || {})
      plugin.migrateConfig(legencyBlogConfig as BlogConfig, blogConfig)
      logger.info("Migrate blog config for", plugin.id)

      // 执行配置校验
      const validRes = plugin.validateConfig!(blogConfig)
      if (!validRes.valid) {
        logger.error(`Plugin ${plugin.id} config is invalid:`, validRes.error)
        return {
          success: false,
          error: {
            name: plugin.id,
            code: "INVALID_CONFIG",
            message: validRes.error!,
          },
        }
      }

      // 执行发布前的钩子
      const beforeProcessResult = await hookManager.executeHooks(HookStage.BEFORE_PROCESS, {
        id: platformConfig.platformKey,
        config: {
          platformConfig,
          legencyBlogConfig,
          blogConfig,
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
          legencyBlogConfig,
          blogConfig,
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
          legencyBlogConfig,
          blogConfig,
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
          legencyBlogConfig,
          blogConfig,
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
          legencyBlogConfig,
          blogConfig,
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
   */
  const normalPublish = async (post: Post, platformConfig: DynamicConfig, publishSetting: DeepReadonly<SypConfig>) => {
    try {
      return quickPublish(post, platformConfig, publishSetting)
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
