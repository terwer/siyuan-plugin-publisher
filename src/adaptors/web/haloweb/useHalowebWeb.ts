/*
 * Copyright (c) 2024, Terwer . All rights reserved.
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

import { HalowebConfig } from "./HalowebConfig"
import { HalowebWebAdaptor } from "~/src/adaptors/web/haloweb/HalowebWebAdaptor.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { DYNAMIC_CONFIG_KEY, LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { DynamicJsonCfg, getDynCfgByKey, getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { PRE_COMTANTS } from "~/src/platforms/PreConstants.ts"
import { ISypConfig } from "~/syp.config"
import { CategoryTypeEnum, PicbedServiceTypeEnum } from "zhi-blog-api"

const getHaloDynCfg = (setting: ISypConfig) => {
  const dynJsonCfg = JsonUtil.safeParse<DynamicJsonCfg>(setting[DYNAMIC_CONFIG_KEY], {} as DynamicJsonCfg)
  const dynamicConfigArray = dynJsonCfg?.totalCfg || []
  return getDynCfgByKey(dynamicConfigArray, PRE_COMTANTS.PRE_CUSTOM_HALOWEB)
}

/**
 * 用于获取Halo 网页版API的自定义Hook
 */
const useHalowebWeb = async (key?: string, newCfg?: HalowebConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-haloweb-web")

  // 记录开始使用Csdn WebAuth
  logger.info("Start using Haloweb WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: HalowebConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    const dynCfg = getHaloDynCfg(setting)
    cfg = JsonUtil.safeParse<HalowebConfig>(setting[key], {} as HalowebConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    const url = new URL(dynCfg.authUrl)
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Csdn的cookie
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new HalowebConfig(url.origin, middlewareUrl)
      cfg.picbedService = PicbedServiceTypeEnum.Bundled
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      if (url.origin !== cfg.home || url.origin !== cfg.apiUrl) {
        // 说明已经改变了
        cfg.home = url.origin
        cfg.apiUrl = url.origin
        logger.info("authUrl has changed, update cfg.home and cfg.apiUrl")
      }
      logger.info("Using configuration from settings...")
    }
    // 下面是强制设置的配置
    const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
    if (StrUtil.isEmptyString(cfg.middlewareUrl)) {
      cfg.middlewareUrl = middlewareUrl
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  // 标签
  cfg.tagEnabled = true
  // Halo 使用多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false
  // picbed service
  cfg.picgoPicbedSupported = true
  cfg.bundledPicbedSupported = true
  const webApi = new HalowebWebAdaptor(appInstance, cfg)

  return {
    cfg,
    webApi,
  }
}

export { useHalowebWeb }
