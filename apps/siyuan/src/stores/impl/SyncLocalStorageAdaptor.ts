/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SyncStorageAdaptor } from "@stores/adaptor/StorageAdaptor"
import { createAppLogger, ILogger } from "@utils/appLogger"
import { JsonUtil } from "zhi-common"

/**
 * 同步本地存储适配器
 *
 * 特点:
 * - 使用浏览器 localStorage 持久化数据
 * - 自动处理 JSON 序列化/反序列化
 * - 支持 TypeScript 类型安全
 * - 异常处理机制
 * - 同步操作
 *
 * @author terwer
 * @since 2.0.0
 */
export class SyncLocalStorageAdaptor<T> implements SyncStorageAdaptor<T> {
  private logger: ILogger = createAppLogger("sync-local-storage-adaptor")

  /**
   * @param storageKey 存储在 localStorage 的唯一标识符
   * @param defaultValue 当存储不存在时的默认值 (可选)
   */
  constructor(
    private readonly storageKey: string,
    private readonly defaultValue: T | null = null,
  ) {}

  /**
   * 加载数据
   * @returns Promise<T | null> 返回解析后的数据或默认值
   */
  load(): T | null {
    try {
      const rawData = localStorage.getItem(this.storageKey)
      if (!rawData) return this.defaultValue

      return JsonUtil.safeParse<T>(rawData, {} as T)
    } catch (e) {
      this.logger.error(`Error loading data from key "${this.storageKey}":`, e)
      return this.defaultValue
    }
  }

  /**
   * 保存数据
   * @param data 要存储的数据
   */
  save(data: T): void {
    try {
      const serializedData = JSON.stringify(data)
      localStorage.setItem(this.storageKey, serializedData)
    } catch (error) {
      this.logger.error(`Error saving data to key "${this.storageKey}":`, error)
      throw new Error("Failed to persist data to localStorage")
    }
  }
}
