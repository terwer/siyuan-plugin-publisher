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

import { BilibiliConfig } from "~/src/adaptors/web/bilibili/bilibiliConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { BilibiliWebAdaptor } from "~/src/adaptors/web/bilibili/bilibiliWebAdaptor.ts"
import { Utils } from "~/src/utils/utils.ts"

/**
 * 用于获取BilibiliWeb的API的自定义Hook
 *
 * @param key - 平台 key
 * @param newCfg - 可选参数，用于指定新的配置
 */
const useBilibiliWeb = async (key?: string, newCfg?: BilibiliConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-bilibili-web")

  // 记录开始使用Bilibili WebAuth
  logger.info("Start using Bilibili WebAuth...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()
  let cfg: BilibiliConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<BilibiliConfig>(setting[key], {} as BilibiliConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Bilibili的cookie
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const bilibiliCookie = Utils.emptyOrDefault(process.env.VITE_BILIBILI_AUTH_TOKEN, "")
      cfg = new BilibiliConfig(bilibiliCookie, middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
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

  // 新平台，暂时不需要强制指定配置

  const webApi = new BilibiliWebAdaptor(appInstance, cfg)
  return {
    cfg,
    webApi,
  }
}

export { useBilibiliWeb }
