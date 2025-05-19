/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { Post } from "zhi-blog-api"
import { PublishConfig } from "@/models/publishConfig.ts"

export interface HookContext {
  id: string
  config: PublishConfig
  post: Post
  data: any
}

export interface HookResult {
  success: boolean
  data?: any
  error?: Error
}

// 全局 Hook 类型
export type GlobalHook = (context: HookContext) => Promise<HookResult>

// 插件 Hook 类型
export type PluginHook = (context: HookContext) => Promise<HookResult>

// Hook 阶段
export enum HookStage {
  BEFORE_PROCESS = "beforeProcess", // 内容预处理前
  AFTER_PROCESS = "afterProcess", // 内容预处理后
  BEFORE_PUBLISH = "beforePublish", // 发布前
  AFTER_PUBLISH = "afterPublish", // 发布后
  BEFORE_UPDATE = "beforeUpdate", // 更新前
  AFTER_UPDATE = "afterUpdate", // 更新后
  BEFORE_DELETE = "beforeDelete", // 删除前
  AFTER_DELETE = "afterDelete", // 删除后
}
