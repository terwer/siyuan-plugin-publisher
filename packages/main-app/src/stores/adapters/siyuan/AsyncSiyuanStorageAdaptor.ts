/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import SiyuanPublisherPlugin from "@/index.ts"
import { AsyncStorageAdaptor } from "@/stores/interfaces/StorageAdaptor.ts"
import { createAppLogger, ILogger } from "@/utils/appLogger.ts"
import { JsonUtil, StrUtil } from "zhi-common"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"

/**
 * 思源存储适配器
 *
 * @author terwer
 * @version 2.0.0
 * @since 2.0.0
 */
export class AsyncSiyuanStorageAdaptor<T> implements AsyncStorageAdaptor<T> {
  private logger: ILogger = createAppLogger("siyuan-storage-adaptor")
  private kernelApi: SiyuanKernelApi

  /**
   * 初始化思源存储适配器
   *
   * @param key 存储唯一标识
   * @param path 存储路径，path和pluginInstance二选一，留空默认为插件存储路径其他位置需要手动设置，例如：/data/20210808180117-6v0mkxr/20200923234011-ieuun1p.sy
   * @param pluginInstance 插件实例，path和pluginInstance二选一，当path为空时使用pluginInstance调用插件 API 持久化
   */
  constructor(
    private key?: string,
    private path?: string,
    private pluginInstance?: SiyuanPublisherPlugin,
  ) {
    const siyuanConfig = new SiyuanConfig(window.location.origin, "")
    this.kernelApi = new SiyuanKernelApi(siyuanConfig)
  }

  async load(): Promise<T | null> {
    try {
      // 开发环境下使用 mock 数据
      if (import.meta.env.DEV) {
        try {
          const response = await fetch("/mock/siyuan-cfg.json")
          if (response.ok) {
            const mockData = await response.json()
            this.logger.info("Loaded mock data from /mock/siyuan-cfg.json")
            return mockData as T
          }
        } catch (e) {
          this.logger.error("Failed to load mock data, falling back to real data")
        }
      }

      if (this.path) {
        const originText = await this.kernelApi.getFile(this.path, "text")
        let txt: string | Record<string, any>
        if (this.key) {
          const originData = JsonUtil.safeParse<Record<string, any>>(originText, {} as any)
          txt = originData?.[this.key] ?? ""
        } else {
          txt = originText
        }
        if (typeof txt === "string" && StrUtil.isEmptyString(txt)) {
          return {} as T
        }
        const data = JsonUtil.safeParse<T>(txt, {} as any)
        this.logger.debug("Loaded data via [siyuan-kernel-api by path] from " + this.key + ":" + this.path)
        return data as T
      } else {
        const data = this.pluginInstance?.loadData(this.key ?? "unknown") ?? null
        this.logger.debug("Loaded data via [siyuan plugin api] from " + this.key)
        return data as T
      }
    } catch (e) {
      this.logger.error("Error loading data from key " + this.key + ":", e)
    }
    return null
  }

  async save(data: T): Promise<void> {
    // 开发环境下 mock 保存操作
    if (import.meta.env.DEV) {
      this.logger.info("Mock saving data in dev mode", data)
      return
    }

    let cfg
    if (this.path) {
      if (!this.key) {
        cfg = data as Record<string, any>
      } else {
        cfg = {
          [this.key]: data,
        }
      }
      await this.kernelApi.saveTextData(this.path, JSON.stringify(cfg))
      this.logger.debug("Saved data via [siyuan-kernel-api by path] to " + this.key + ":" + this.path, data)
    } else {
      if (!this.key) {
        throw new Error("key is required for plugin storage")
      }
      cfg = data as Record<string, any>
      this.pluginInstance?.saveData(this.key, cfg)
      this.logger.debug("Saved data via [siyuan plugin api] to " + this.key, data)
    }
  }
}
