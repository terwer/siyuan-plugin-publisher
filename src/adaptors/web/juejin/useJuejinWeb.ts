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

import { JuejinConfig } from "~/src/adaptors/web/juejin/JuejinConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { JuejinWebAdaptor } from "~/src/adaptors/web/juejin/juejinWebAdaptor.ts"

/**
 * 用于获取JuejinWeb的API的自定义Hook
 */
const useJuejinWeb = async (key?: string, newCfg?: JuejinConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-juejin-web")

  // 记录开始使用Juejin WebAuth
  logger.info("Start using Juejin WebAuth...")

  // 创建应用实例
  const appInstance = new AppInstance()
  let cfg: JuejinConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = useSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<JuejinConfig>(setting[key], {} as JuejinConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      const middlewareUrl = Utils.emptyOrDefault(
        process.env.VITE_MIDDLEWARE_URL,
        "https://api.terwer.space/api/middleware"
      )
      // 从环境变量获取Juejin的cookie
      const juejinCookie = Utils.emptyOrDefault(process.env.VITE_JUEJIN_AUTH_TOKEN, "")
      cfg = new JuejinConfig("", juejinCookie, middlewareUrl)
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

  const webApi = new JuejinWebAdaptor(appInstance, cfg)
  return {
    webApi,
  }
}

export { useJuejinWeb }
