/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { GlobalHook, HookContext, HookResult, HookStage, PluginHook } from "siyuan-plugin-publisher-types"
import logger from "@/utils/logger.ts"

export class HookManager {
  private static instance: HookManager
  private globalHooks: Map<HookStage, GlobalHook[]> = new Map()
  private pluginHooks: Map<string, Map<HookStage, PluginHook[]>> = new Map()

  private constructor() {
    // 初始化所有阶段的空数组
    Object.values(HookStage).forEach((stage) => {
      this.globalHooks.set(stage, [])
    })
  }

  static getInstance(): HookManager {
    if (!HookManager.instance) {
      HookManager.instance = new HookManager()
    }
    return HookManager.instance
  }

  // 注册全局 Hook
  registerGlobalHook(stage: HookStage, hook: GlobalHook): void {
    // 验证 stage 是否合法
    if (!Object.values(HookStage).includes(stage)) {
      throw new Error(`Invalid hook stage: ${stage}`)
    }
    const hooks = this.globalHooks.get(stage) || []
    // 检查是否已经存在相同的 hook
    if (hooks.includes(hook)) {
      logger.warn(`Hook already registered for stage: ${stage}`)
      return
    }
    hooks.push(hook)
    this.globalHooks.set(stage, hooks)
    logger.info(`Registered global hook for stage: ${stage}`)
  }

  // 注册插件 Hook
  registerPluginHook(id: string, stage: HookStage, hook: PluginHook): void {
    // 验证 stage 是否合法
    if (!Object.values(HookStage).includes(stage)) {
      throw new Error(`Invalid hook stage: ${stage}`)
    }
    if (!this.pluginHooks.has(id)) {
      this.pluginHooks.set(id, new Map())
    }
    const platformHooks = this.pluginHooks.get(id)!
    const hooks = platformHooks.get(stage) || []
    // 检查是否已经存在相同的 hook
    if (hooks.includes(hook)) {
      logger.warn(`Hook already registered for platform: ${id}, stage: ${stage}`)
      return
    }
    hooks.push(hook)
    platformHooks.set(stage, hooks)
    logger.info(`Registered plugin hook for platform: ${id}, stage: ${stage}`)
  }

  // 取消注册

  /**
   * 取消注册一个全局 Hook
   *
   * @param stage 阶段
   * @param hook 要移除的 Hook 函数
   */
  unregisterGlobalHook(stage: HookStage, hook: GlobalHook): void {
    // 验证 stage 是否合法
    if (!Object.values(HookStage).includes(stage)) {
      throw new Error(`Invalid hook stage: ${stage}`)
    }

    const hooks = this.globalHooks.get(stage)
    if (!hooks || hooks.length === 0) {
      logger.warn(`No global hooks found for stage: ${stage}`)
      return
    }

    const index = hooks.indexOf(hook)
    if (index !== -1) {
      hooks.splice(index, 1)
      logger.info(`Unregistered global hook for stage: ${stage}`)
    }
  }

  /**
   * 取消注册一个插件 Hook
   *
   * @param id 平台标识
   * @param stage 阶段
   * @param hook 要移除的 Hook 函数
   */
  unregisterPluginHook(id: string, stage: HookStage, hook: PluginHook): void {
    // 验证 stage 是否合法
    if (!Object.values(HookStage).includes(stage)) {
      throw new Error(`Invalid hook stage: ${stage}`)
    }

    const platformHooks = this.pluginHooks.get(id)
    if (!platformHooks || platformHooks.size === 0) {
      logger.warn(`No plugin hooks found for platform: ${id}`)
      return
    }

    const hooks = platformHooks.get(stage)
    if (hooks) {
      const index = hooks.indexOf(hook)
      if (index !== -1) {
        hooks.splice(index, 1)
        logger.info(`Unregistered plugin hook for platform: ${id}, stage: ${stage}`)
      }
    }
  }

  // 执行 Hook 链
  async executeHooks(stage: HookStage, context: HookContext): Promise<HookResult> {
    logger.info(`Executing hooks for stage: ${stage}, platform: ${context.id}`)

    const errorMessages: string[] = []
    // 深拷贝上下文
    const mutableContext = structuredClone(context)

    // 执行全局 Hook
    const globalHooks = this.globalHooks.get(stage) || []
    for (const hook of globalHooks) {
      try {
        const result = await hook(mutableContext)
        if (!result.success) {
          const errorMsg = result.error?.message ?? "Unknown global hook failure"
          logger.warn(`Global hook failed but continue execution`, result.error)
          errorMessages.push(errorMsg)
        }

        if (result.data) {
          mutableContext.data = result.data
        }
      } catch (error) {
        const errorMsg = (error as Error).message ?? "Unknown global hook error"
        logger.warn(`Global hook threw an error but continue execution`, error)
        errorMessages.push(errorMsg)
      }
    }

    // 执行插件特定 Hook
    const platformHooks = this.pluginHooks.get(context.id)
    if (platformHooks) {
      const hooks = platformHooks.get(stage) || []
      for (const hook of hooks) {
        try {
          const result = await hook(mutableContext)
          if (!result.success) {
            const errorMsg = result.error?.message ?? "Unknown plugin hook failure"
            logger.warn(`Plugin hook failed but continue execution`, result.error)
            errorMessages.push(errorMsg)
          }

          if (result.data) {
            mutableContext.data = result.data
          }
        } catch (error) {
          const errorMsg = (error as Error).message ?? "Unknown plugin hook error"
          logger.warn(`Plugin hook threw an error but continue execution`, error)
          errorMessages.push(errorMsg)
        }
      }
    }

    if (errorMessages.length > 0) {
      const combinedErrorMessage = errorMessages.join(";\n")
      logger.warn(`One or more hooks failed during execution for stage: ${stage} =>`, combinedErrorMessage)
      return {
        success: false,
        error: new Error(combinedErrorMessage),
      }
    }

    logger.info(`All hooks executed successfully for stage: ${stage}`)
    return { success: true, data: mutableContext.data }
  }

  /**
   * 获取指定阶段的全局 Hook
   *
   * @param stage 阶段
   */
  getGlobalHooks(stage: HookStage): GlobalHook[] {
    return this.globalHooks.get(stage) || []
  }

  /**
   * 获取指定平台和阶段的插件 Hook
   *
   * @param id
   * @param stage
   */
  getPluginHooks(id: string, stage: HookStage): PluginHook[] | undefined {
    const platformHooks = this.pluginHooks.get(id)
    return platformHooks ? platformHooks.get(stage) : undefined
  }

  // 清除所有全局 Hooks
  clearGlobalHooks(): void {
    Object.values(HookStage).forEach((stage) => {
      this.globalHooks.set(stage, [])
    })
    logger.info("Cleared all global hooks")
  }

  // 清除特定平台的插件 Hooks
  clearPluginHooks(id: string): void {
    if (this.pluginHooks.has(id)) {
      this.pluginHooks.delete(id)
      logger.info(`Cleared all plugin hooks for platform: ${id}`)
    }
  }

  // 清除所有 Hooks（包括全局和所有平台的插件 Hooks）
  clearAllHooks(): void {
    // 清除全局 Hooks
    this.clearGlobalHooks()
    // 清除所有平台的插件 Hooks
    this.pluginHooks.clear()
    logger.info("Cleared all hooks (global and plugin hooks)")
  }
}
