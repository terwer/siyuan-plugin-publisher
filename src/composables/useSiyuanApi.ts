/*
 * Copyright (c) 2023, Terwer . All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.  Terwer designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Terwer in the LICENSE file that accompanied this code.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Terwer, Shenzhen, Guangdong, China, youweics@163.com
 * or visit www.terwer.space if you need additional information or have any
 * questions.
 */

import { SiYuanApiAdaptor, SiyuanConfig, SiyuanKernelApi } from "zhi-siyuan-api"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { useSiyuanDevice } from "~/src/composables/useSiyuanDevice.ts"
import { useSiyuanSettingStore } from "~/src/stores/useSiyuanSettingStore.ts"
import { Utils } from "~/src/utils/utils.ts"
import { usePreferenceSettingStore } from "~/src/stores/usePreferenceSettingStore.ts"

/**
 * 通用 Siyuan API 封装
 */
export const useSiyuanApi = () => {
  const logger = createAppLogger("use-siyuan-api")
  const { getReadOnlySiyuanSetting } = useSiyuanSettingStore()
  const { getReadOnlyPublishPreferenceSetting } = usePreferenceSettingStore()

  // 环境变量
  const envSiyuanApiUrl = Utils.emptyOrDefault(process.env.VITE_SIYUAN_API_URL, "")
  const envSiyuanAuthToken = Utils.emptyOrDefault(process.env.VITE_SIYUAN_AUTH_TOKEN, "")
  const envSiyuanCookie = Utils.emptyOrDefault(process.env.VITE_SIYUAN_COOKIE, "")
  // 获取配置
  const pref = getReadOnlyPublishPreferenceSetting()
  const siyuanSetting = getReadOnlySiyuanSetting()
  // 设置
  const siyuanApiUrl = Utils.emptyOrDefault(siyuanSetting.value.apiUrl, envSiyuanApiUrl)
  const siyuanAuthToken = Utils.emptyOrDefault(siyuanSetting.value.password, envSiyuanAuthToken)
  const siyuanConfig = new SiyuanConfig(siyuanApiUrl, siyuanAuthToken)
  siyuanConfig.cookie = Utils.emptyOrDefault(siyuanSetting.value.cookie, envSiyuanCookie)
  siyuanConfig.preferenceConfig.fixTitle = pref.value.fixTitle
  siyuanConfig.preferenceConfig.keepTitle = pref.value.keepTitle
  siyuanConfig.preferenceConfig.removeFirstH1 = pref.value.removeFirstH1
  siyuanConfig.preferenceConfig.removeMdWidgetTag = pref.value.removeMdWidgetTag

  const blogApi = new SiYuanApiAdaptor(siyuanConfig)
  const kernelApi = new SiyuanKernelApi(siyuanConfig)
  const { isInChromeExtension } = useSiyuanDevice()
  const isStorageViaSiyuanApi = () => {
    // docker - 在 .env.docker 配置 VITE_DEFAULT_TYPE=siyuan
    // vercel - 在环境变量配置 VITE_DEFAULT_TYPE=siyuan
    // node - 启动参数加 VITE_DEFAULT_TYPE=siyuan node VITE_SIYUAN_API_URL=http://127.0.0.1:6806
    // 插件SPA(PC客户端) - VITE_DEFAULT_TYPE: siyuan
    // 插件SPA(Docker浏览器客户端) - VITE_DEFAULT_TYPE: siyuan
    // 插件SPA(本地客户端浏览器) - VITE_DEFAULT_TYPE: siyuan
    // const storeViaSiyuanApi = process.env.VITE_DEFAULT_TYPE === "siyuan"
    const defaultType = process.env.VITE_DEFAULT_TYPE ?? "siyuan"
    const storeViaSiyuanApi = defaultType === "siyuan"
    logger.info("defaultType=>", defaultType)
    logger.info("storeViaSiyuanApi=>", String(storeViaSiyuanApi))
    return storeViaSiyuanApi
  }

  const isUseSiyuanProxy = () => {
    if (isInChromeExtension()) {
      return false
    }

    return isStorageViaSiyuanApi()
  }

  return {
    blogApi,
    kernelApi,
    siyuanConfig,
    isStorageViaSiyuanApi,
    isUseSiyuanProxy,
  }
}
