/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StorageLikeAsync } from "@vueuse/core"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { StrUtil } from "zhi-common"
import { useSiyuanApi } from "~/src/composables/useSiyuanApi.ts"
import { SiyuanDevice } from "zhi-device"

/**
 * 通用存储实现，实现了 `StorageLikeAsync` 接口。
 * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L11
 *
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
class CommonStorageAsync implements StorageLikeAsync {
  private readonly logger
  private readonly storageViaSiyuanApi
  private readonly kernelApi
  public readonly key

  constructor(storageKey: string) {
    this.logger = createAppLogger("common-storage")

    const { isStorageViaSiyuanApi, kernelApi } = useSiyuanApi()
    this.storageViaSiyuanApi = isStorageViaSiyuanApi()
    this.kernelApi = kernelApi

    if (this.storageViaSiyuanApi) {
      this.key = storageKey
    } else {
      const fileName = storageKey.split("/").pop() ?? ""
      this.key = fileName.slice(0, fileName.lastIndexOf("."))
    }
  }

  /**
   * 异步获取与给定键关联的值。
   *
   * @param key - 要获取值的键。
   * @returns 一个 Promise，它解析为与给定键关联的值，如果键不存在则解析为 `null`。
   */
  public async getItem(key: string): Promise<string | null> {
    this.logger.info(`Retrieving value for '${key}' from CommonStorage.`)
    let ret: any
    if (this.storageViaSiyuanApi) {
      // 如果当前运行在思源笔记中
      try {
        ret = (await this.kernelApi.getFile(key, "text")) ?? ""
        // this.logger.debug(`Use SiYuan Api LocalStorageAdaptor to getItem - Retrieving '${key}', Value: ${ret}`)
      } catch (e1) {
        this.logger.error(`Failed to get value for key '${key}' from SiYuan Api LocalStorageAdaptor. Error:`, e1)
      }
    } else {
      try {
        const win = SiyuanDevice.siyuanWindow()
        const value = win.localStorage.getItem(key)
        ret = value ?? ""
        // this.logger.debug(`Use Browser LocalStorageAdaptor to getItem - Retrieving '${key}', Value: ${ret}`)
      } catch (e2) {
        this.logger.error(`Failed to get value for key '${key}' from Browser LocalStorageAdaptor. Error:`, e2)
      }
    }

    // 根据 ret 的值返回不同类型的结果
    if (StrUtil.isEmptyString(ret)) {
      ret = "{}"
    }
    // this.logger.debug(`Final getItem - '${key}', Value: '${ret}'`)
    return ret
  }

  /**
   * 异步删除与给定键关联的值。
   *
   * @param key - 要删除值的键。
   * @returns 一个 Promise，在删除值后解析。
   */
  public async removeItem(key: string): Promise<void> {
    this.logger.info(`Removing value for ${key} from CommonStorage.`)
  }

  /**
   * 异步设置与给定键关联的值。
   *
   * @param key - 要设置值的键。
   * @param value - 给定键的新值。
   * @returns 一个 Promise，在设置值后解析。
   */
  public async setItem(key: string, value: string): Promise<void> {
    // this.logger.debug(`Setting value for '${key}' in CommonStorageAsync to '${value}'.`)
    if (this.storageViaSiyuanApi) {
      // 如果当前运行在思源笔记中，则直接返回空字符串
      try {
        const res = await this.kernelApi.saveTextData(key, value)
        this.logger.debug(`Use SiYuan Api LocalStorageAdaptor to setItem - Key '${key}'`, res)
      } catch (e) {
        this.logger.errot(`Failed to set value for key '${key}' from SiYuan Api LocalStorageAdaptor. Error:`, e)
      }
    } else {
      const win = SiyuanDevice.siyuanWindow()
      win.localStorage.setItem(key, value)
      this.logger.debug(`Use Browser LocalStorageAdaptor to setItem - Key '${key}'`)
    }
  }
}

export default CommonStorageAsync
