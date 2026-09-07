/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { JsonUtil } from "zhi-common"

/**
 * 安全反序列化配置并合并构造函数默认值
 *
 * 解决 JsonUtil.safeParse 跳过构造函数导致平台特定配置丢失的问题。
 * 先通过构造函数创建带默认值的实例，再用存储的 JSON 覆盖，
 * 确保构造函数初始化的平台特定配置（如 knowledgeSpaceTitle、placeholder 等）
 * 在存储数据中缺失时仍能作为 fallback 存在。
 *
 * @param storedJson 存储的 JSON 字符串
 * @param ConfigClass 配置类构造函数
 * @param defaultArgs 传给构造函数的默认参数（通常传空字符串）
 * @returns 合并后的配置实例
 */
export function safeMergeConfig<T extends object>(
  storedJson: string,
  ConfigClass: new (...args: any[]) => T,
  defaultArgs: any[]
): T {
  const stored = JsonUtil.safeParse<Partial<T>>(storedJson, {} as Partial<T>)
  const defaults = new ConfigClass(...defaultArgs)
  return Object.assign(defaults, stored) as T
}
