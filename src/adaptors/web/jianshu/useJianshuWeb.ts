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

import { JianshuConfig } from "~/src/adaptors/web/jianshu/config/JianshuConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { JianshuWebAdaptor } from "~/src/adaptors/web/jianshu/adaptor/jianshuWebAdaptor.ts"

/**
 * 用于获取JianshuWeb的API的自定义Hook
 */
const useJianshuWeb = async (key?: string, newCfg?: JianshuConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-jianshu-web")

  // 记录开始使用Jianshu WebAuth
  logger.info("Start using Jianshu WebAuth...")

  // 创建应用实例
  const appInstance = new AppInstance()
  let cfg: JianshuConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = useSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<JianshuConfig>(setting[key], {} as JianshuConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Jianshu的cookie
      const jianshuCookie = Utils.emptyOrDefault(process.env.VITE_JIANSHU_AUTH_TOKEN, "")
      cfg = new JianshuConfig(jianshuCookie)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    const middlewareUrl = Utils.emptyOrDefault(
      process.env.VITE_MIDDLEWARE_URL,
      "https://api.terwer.space/api/middleware"
    )
    if (StrUtil.isEmptyString(cfg.middlewareUrl)) {
      cfg.middlewareUrl = middlewareUrl
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  const webApi = new JianshuWebAdaptor(appInstance, cfg)
  return {
    webApi,
  }
}

export { useJianshuWeb }
