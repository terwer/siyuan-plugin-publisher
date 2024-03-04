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

import { TelegraphConfig } from "~/src/adaptors/api/telegraph/telegraphConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { TelegraphApiAdaptor } from "~/src/adaptors/api/telegraph/telegraphApiAdaptor.ts"
import { CORS_PROXT_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"

const useTelegraphApi = async (key: string, newCfg?: TelegraphConfig) => {
  const logger = createAppLogger("use-telegraph-api")
  logger.info("Start using Telegraph API...")

  const appInstance = new PublisherAppInstance()

  let cfg: TelegraphConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<TelegraphConfig>(setting[key], {} as TelegraphConfig)

    if (ObjectUtil.isEmptyObject(cfg)) {
      const telegraphUrl = Utils.emptyOrDefault(process.env.VITE_TELEGRAPH_URL, "https://telegra.ph")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      const telegraphToken = Utils.emptyOrDefault(process.env.VITE_TELEGRAPH_TOKEN, CORS_PROXT_URL)
      cfg = new TelegraphConfig(telegraphUrl, telegraphToken, middlewareUrl)
      logger.info("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }

    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
    // 初始化corsAnywhereUrl
    if (StrUtil.isEmptyString(cfg.corsAnywhereUrl)) {
      // 默认值
      cfg.corsAnywhereUrl = Utils.emptyOrDefault(process.env.VITE_CORS_ANYWHERE_URL, CORS_PROXT_URL)
    }
  }

  cfg.usernameEnabled = true
  cfg.cateEnabled = false
  cfg.tagEnabled = false

  const blogApi = new TelegraphApiAdaptor(appInstance, cfg)
  logger.info("Telegraph API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}

export { useTelegraphApi }
