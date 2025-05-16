/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

/**
 * 异步存储适配器接口
 *
 * @author terwer
 * @since 2.0.0
 */
export interface AsyncStorageAdaptor<T> {
  /**
   * 异步加载数据
   */
  load(): Promise<T | null>

  /**
   * 异步保存数据
   */
  save(data: T): Promise<void>
}

/**
 * 同步存储适配器接口
 *
 * @author terwer
 * @since 2.0.0
 */
export interface SyncStorageAdaptor<T> {
  /**
   * 加载数据
   */
  load(): T | null

  /**
   * 保存数据
   */
  save(data: T): void
}
