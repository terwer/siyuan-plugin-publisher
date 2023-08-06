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
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { TypechoConfig } from "~/src/adaptors/api/typecho/typechoConfig.ts"
import {JsonUtil, ObjectUtil, StrUtil} from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { TypechoApiAdaptor } from "~/src/adaptors/api/typecho/typechoApiAdaptor.ts"

/**
 * 使用Typecho API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const useTypechoApi = async (key?: string, newCfg?: TypechoConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-typecho-api")

  // 记录开始使用Typecho API
  logger.info("Start using Typecho API...")

  // 创建应用实例
  const appInstance = new AppInstance()

  let cfg: TypechoConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = useSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<TypechoConfig>(setting[key], {} as TypechoConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Typecho API的URL、用户名、认证令牌和中间件URL
      const typechoApiUrl = Utils.emptyOrDefault(process.env.VITE_TYPECHO_API_URL, "http://your-typecho-home.com/")
      const typechoUsername = Utils.emptyOrDefault(process.env.VITE_TYPECHO_USERNAME, "")
      const typechoAuthToken = Utils.emptyOrDefault(process.env.VITE_TYPECHO_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(
        process.env.VITE_MIDDLEWARE_URL,
        "https://api.terwer.space/api/middleware"
      )
      cfg = new TypechoConfig(typechoApiUrl, typechoUsername, typechoAuthToken, middlewareUrl)
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

  // 创建Typecho API适配器
  const blogApi = new TypechoApiAdaptor(appInstance, cfg)
  logger.info("Typecho API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}
