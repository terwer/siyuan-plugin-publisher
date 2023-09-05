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
import { Utils } from "~/src/utils/utils.ts"
import { CnblogsConfig } from "~/src/adaptors/api/cnblogs/cnblogsConfig.ts"
import { CnblogsApiAdaptor } from "~/src/adaptors/api/cnblogs/cnblogsApiAdaptor.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { useSettingStore } from "~/src/stores/useSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"

/**
 * 使用Cnblogs API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg
 * @author terwer
 * @version 0.9.0
 * @since 0.9.0
 */
export const useCnblogsApi = async (key?: string, newCfg?: CnblogsConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-cnblogs-api")

  // 记录开始使用Cnblogs API
  logger.info("Start using Cnblogs API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: CnblogsConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = useSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<CnblogsConfig>(setting[key], {} as CnblogsConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Cnblogs API的URL、用户名、认证令牌和中间件URL
      const cnblogsApiUrl = Utils.emptyOrDefault(
        process.env.VITE_CNBLOGS_API_URL,
        "https://rpc.cnblogs.com/metaweblog/[your-blog-name]"
      )
      const cnblogsUsername = Utils.emptyOrDefault(process.env.VITE_CNBLOGS_USERNAME, "")
      const cnblogsAuthToken = Utils.emptyOrDefault(process.env.VITE_CNBLOGS_AUTH_TOKEN, "")
      const middlewareUrl = Utils.emptyOrDefault(
        process.env.VITE_MIDDLEWARE_URL,
        "https://api.terwer.space/api/middleware"
      )

      cfg = new CnblogsConfig(cnblogsApiUrl, cnblogsUsername, cnblogsAuthToken, middlewareUrl)
      logger.debug("Configuration is empty, using default environment variables.")
    } else {
      logger.info("Using configuration from settings...")
    }
    // 初始化posidKey
    if (StrUtil.isEmptyString(cfg.posidKey)) {
      // 默认值
      cfg.posidKey = getDynPostidKey(key)
    }
  }

  // 博客园使用多选分类
  cfg.tagEnabled = true
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false

  // 创建Cnblogs API适配器
  const blogApi = new CnblogsApiAdaptor(appInstance, cfg)

  // 记录Cnblogs API创建成功
  logger.info("Cnblogs API created successfully.")

  return {
    cfg,
    blogApi,
  }
}
