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

import { IPublishCfg } from "~/src/types/IPublishCfg.ts"
import { JsonUtil } from "zhi-common"
import { AppInstance } from "~/src/appInstance.ts"
import Adaptors from "~/src/adaptors"
import { Utils } from "~/src/utils/utils.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { DynamicJsonCfg, getDynCfgByKey } from "~/src/platforms/dynamicConfig.ts"
import { DYNAMIC_CONFIG_KEY } from "~/src/utils/constants.ts"
import { BlogAdaptor, BlogConfig, WebAdaptor } from "zhi-blog-api"

/**
 * 获取发布配置的自定义钩子
 *
 * @author terwer
 * @since 1.3.2
 */
const usePublishConfig = () => {
  const { getSetting } = useSettingStore()
  const appInstance = new AppInstance()

  /**
   * 获取指定键的发布配置
   *
   * @param {string} key - 配置键名
   * @returns {Promise<IPublishCfg>} - 返回一个 Promise 对象，包含发布配置项
   */
  const getPublishCfg = async (key?: string): Promise<IPublishCfg> => {
    // 加载配置
    const setting = await getSetting()

    // 平台定义
    const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
    const dynamicConfigArray = dynJsonCfg?.totalCfg || []

    // 平台配置
    if (key) {
      const storedCfg = JsonUtil.safeParse<any>(setting[key], {} as any)
      const cfg = await Adaptors.getCfg(key, storedCfg)
      const dynCfg = getDynCfgByKey(dynamicConfigArray, key)

      return {
        setting,
        dynamicConfigArray,
        cfg,
        dynCfg,
      }
    } else {
      return {
        setting,
        dynamicConfigArray,
        cfg: undefined,
        dynCfg: undefined,
      }
    }
  }

  /**
   * 获取发布API
   *
   * @param key - API key
   * @param cfg - 可选的配置项
   * @returns Promise<BlogAdaptor | WebAdaptor> - 返回一个 Promise 对象，包含 BlogAdaptor 或 WebAdaptor
   */
  const getPublishApi = async (key: string, cfg?: BlogConfig): Promise<BlogAdaptor | WebAdaptor> => {
    // 初始化API
    const apiAdaptor = await Adaptors.getAdaptor(key, cfg)
    const api = Utils.blogApi(appInstance, apiAdaptor)
    return api
  }

  // /**
  //  * 获取YAML API
  //  *
  //  * @param key - 平台配置的键值
  //  * @param newCfg - 可选参数，用于指定新的配置
  //  * @returns 返回一个Promise，包含YAML适配器
  //  */
  // const getYamlApi = async (key: string, newCfg?: any) => {
  //   const yamlAdaptor = await Adaptors.getYamlAdaptor(key, newCfg)
  //   return yamlAdaptor
  // }

  return {
    getPublishCfg,
    getPublishApi,
  }
}

export { usePublishConfig }
