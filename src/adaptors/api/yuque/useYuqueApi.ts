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

import { createAppLogger } from "~/src/utils/appLogger.ts"
import { AppInstance } from "~/src/appInstance.ts"
import { Utils } from "~/src/utils/utils.ts"
import { YuqueConfig } from "~/src/adaptors/api/yuque/config/yuqueConfig.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import {JsonUtil, ObjectUtil, StrUtil} from "zhi-common"
import { getDynPostidKey } from "~/src/components/set/publish/platform/dynamicConfig.ts"
import { YuqueApiAdaptor } from "~/src/adaptors/api/yuque/adaptor/yuqueApiAdaptor.ts"

const useYuqueApi = async (key: string, newCfg?: YuqueConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-yuque-api")

  // 记录开始使用 Yuque API
  logger.info("Start using Yuque API...")

  // 创建应用实例
  const appInstance = new AppInstance()

  let cfg: YuqueConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = useSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<YuqueConfig>(setting[key], {} as YuqueConfig)

    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取 Yuque API 的 URL、认证令牌和其他配置信息
      const yuqueUsername = Utils.emptyOrDefault(process.env.VITE_YUQUE_USERNAME, "")
      const yuqueAuthToken = Utils.emptyOrDefault(process.env.VITE_YUQUE_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(
        process.env.VITE_MIDDLEWARE_URL,
        "https://api.terwer.space/api/middleware"
      )
      cfg = new YuqueConfig(yuqueUsername, yuqueAuthToken, middlewareUrl)
      logger.info("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  // 创建 Yuque API 适配器
  const blogApi = new YuqueApiAdaptor(appInstance, cfg)
  logger.info("Yuque API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useYuqueApi }
