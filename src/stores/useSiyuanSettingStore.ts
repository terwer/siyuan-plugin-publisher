/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { SiyuanConfig } from "zhi-siyuan-api"
import { RemovableRef, StorageSerializers } from "@vueuse/core"
import { readonly } from "vue"
import { SiyuanDevice } from "zhi-device"
import useCommonLocalStorage from "~/src/stores/common/useCommonLocalStorage.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { Utils } from "~/src/utils/utils.ts"
import { StrUtil } from "zhi-common"

/**
 * 思源笔记设置
 *
 * @author terwer
 * @version 1.8.0
 * @since 1.8.0
 */
const useSiyuanSettingStore = () => {
  const filePath = "storage/syp/siyuan-cfg.json"
  const storageKey = "siyuan-cfg"

  /**
   * 获取思源笔记配置
   *
   * @author terwer
   * @since 0.6.0
   */
  const getSiyuanSetting = (): RemovableRef<SiyuanConfig> => {
    const baseUrl = "http://127.0.0.1:6806"
    const token = ""
    const middlewareUrl = LEGENCY_SHARED_PROXT_MIDDLEWARE
    // 统一自动读取思源地址
    let origin: string
    const win = SiyuanDevice.siyuanWindow()
    origin = win?.location.origin

    // 顺序
    // 1、环境变量
    // 2、origin
    // 3、默认值
    const envSiyuanApiUrl = Utils.emptyOrDefault(process.env.VITE_SIYUAN_API_URL, origin)
    const siyuanApiUrl = Utils.emptyOrDefault(envSiyuanApiUrl, baseUrl)
    const initialValue = new SiyuanConfig(siyuanApiUrl, token)
    initialValue.middlewareUrl = middlewareUrl
    const siyuanConfig = useCommonLocalStorage<SiyuanConfig>(filePath, storageKey, initialValue, {
      serializer: StorageSerializers.object,
    })

    // 更新apiUrl，兼容旧数据的情况
    if (!StrUtil.isEmptyString(siyuanApiUrl)) {
      siyuanConfig.value.apiUrl = siyuanApiUrl
    }
    return siyuanConfig
  }

  /**
   * 获取只读版本的思源笔记配置
   * 调用现有的 getSiyuanSetting 并转化为只读
   *
   * @author terwer
   * @since 0.6.0
   */
  const getReadOnlySiyuanSetting = () => {
    const siyuanConfigRef = getSiyuanSetting()
    const readOnlySiyuanConfigRef = readonly(siyuanConfigRef)
    return readOnlySiyuanConfigRef
  }

  return { getSiyuanSetting, getReadOnlySiyuanSetting }
}

export { useSiyuanSettingStore }
