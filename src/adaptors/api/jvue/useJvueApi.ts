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

import { JvueConfig } from "~/src/adaptors/api/jvue/jvueConfig.ts"
import { createAppLogger } from "~/src/utils/appLogger.ts"
import { PublisherAppInstance } from "~/src/publisherAppInstance.ts"
import { usePublishSettingStore } from "~/src/stores/usePublishSettingStore.ts"
import { JsonUtil, ObjectUtil, StrUtil } from "zhi-common"
import { Utils } from "~/src/utils/utils.ts"
import { LEGENCY_SHARED_PROXT_MIDDLEWARE } from "~/src/utils/constants.ts"
import { getDynPostidKey } from "~/src/platforms/dynamicConfig.ts"
import { CategoryTypeEnum } from "zhi-blog-api"
import { JvueApiAdaptor } from "~/src/adaptors/api/jvue/jvueApiAdaptor.ts"

/**
 * 使用Jvue API的自定义hook
 *
 * @param key 配置键值，可选参数
 * @param newCfg 新配置信息
 * @author terwer
 * @version 1.20.0
 * @since 1.20.0
 */
export const useJvueApi = async (key?: string, newCfg?: JvueConfig) => {
  // 创建应用日志记录器
  const logger = createAppLogger("use-jvue-api")

  // 记录开始使用Jvue API
  logger.info("Start using Jvue API...")

  // 创建应用实例
  const appInstance = new PublisherAppInstance()

  let cfg: JvueConfig
  if (newCfg) {
    logger.info("Initialize with the latest newCfg passed in...")
    cfg = newCfg
  } else {
    // 从配置中获取数据
    const { getSetting } = usePublishSettingStore()
    const setting = await getSetting()
    cfg = JsonUtil.safeParse<JvueConfig>(setting[key], {} as JvueConfig)
    // 如果配置为空，则使用默认的环境变量值，并记录日志
    if (ObjectUtil.isEmptyObject(cfg)) {
      // 从环境变量获取Jvue API的URL、用户名、认证令牌和中间件URL
      const jvueHome = Utils.emptyOrDefault(process.env.VITE_JVUE_HOME, "")
      const jvueApiUrl = Utils.emptyOrDefault(process.env.VITE_JVUE_API_URL, "")
      const jvueUsername = Utils.emptyOrDefault(process.env.VITE_JVUE_USERNAME, "")
      const jvueAuthToken = Utils.emptyOrDefault(process.env.VITE_JVUE_PASSWORD, "")
      const middlewareUrl = Utils.emptyOrDefault(process.env.VITE_MIDDLEWARE_URL, LEGENCY_SHARED_PROXT_MIDDLEWARE)
      cfg = new JvueConfig(jvueHome, jvueApiUrl, jvueUsername, jvueAuthToken, middlewareUrl)
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

  // 标签
  cfg.tagEnabled = true
  // Jvue使用多选分类
  cfg.cateEnabled = true
  cfg.categoryType = CategoryTypeEnum.CategoryType_Multi
  cfg.allowCateChange = true
  cfg.knowledgeSpaceEnabled = false

  // 创建Jvue API适配器
  const blogApi = new JvueApiAdaptor(appInstance, cfg)
  logger.info("Jvue API created successfully.", cfg)

  return {
    cfg,
    blogApi,
  }
}
