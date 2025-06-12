/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SyncStorageAdaptor } from "@/stores/interfaces/StorageAdaptor.ts"

/**
 * 同步内存缓存
 *
 * @author terwer
 * @since 2.0.0
 */
export class SyncMemoryStorageAdaptor<T> implements SyncStorageAdaptor<T> {
  private cache = new Map<string, T>()

  load(): T | null {
    return this.cache.get("default") || null
  }

  save(data: T): void {
    this.cache.set("default", data)
  }
}
