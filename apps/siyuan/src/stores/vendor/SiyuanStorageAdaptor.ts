/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StorageAdaptor } from "@stores/core/StorageAdaptor.ts"
import { createAppLogger, ILogger } from "@utils/appLogger.ts"
import { SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import SiyuanPublisherPlugin from "@/index.ts"
import { JsonUtil, StrUtil } from "zhi-common"

export class SiyuanStorageAdaptor<T> implements StorageAdaptor<T> {
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
    private key: string,
    private path?: string,
    private pluginInstance?: SiyuanPublisherPlugin,
  ) {
    const siyuanConfig = new SiyuanConfig(window.location.origin, "")
    this.kernelApi = new SiyuanKernelApi(siyuanConfig)
  }

  async load(): Promise<T | null> {
    try {
      if (this.path) {
        const originText = await this.kernelApi.getFile(this.path, "text")
        const originData = JsonUtil.safeParse<Record<string, string>>(
          originText,
          {} as any,
        )
        const txt = originData[this.key]
        if (StrUtil.isEmptyString(txt)) {
          return null
        }
        const data = JsonUtil.safeParse<T>(txt, {} as any)
        this.logger.debug(
          "Loaded data via [siyuan-kernel-api by path] from " +
            this.key +
            ":" +
            this.path,
        )
        return data as T
      } else {
        const data = this.pluginInstance?.loadData(this.key) ?? null
        this.logger.debug(
          "Loaded data via [siyuan plugin api] from " + this.key,
        )
        return data as T
      }
    } catch (e) {
      this.logger.error("Error loading data from key " + this.key + ":", e)
    }
    return null
  }

  async save(data: T): Promise<void> {
    // await window.hostAPI.set(this.hostKey, JSON.stringify(data))
    this.logger.debug("Saved data via siyuan-storage adapter", data)
  }
}
