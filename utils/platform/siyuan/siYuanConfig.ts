/*
 * Copyright (c) 2022-2023, Terwer . All rights reserved.
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

import envUtil, { getEnv } from "~/utils/envUtil"
import { getJSONConf } from "~/utils/configUtil"
import { SIYUAN_CONSTANTS } from "~/utils/constants/siyuanConstants"
import { isEmptyString } from "~/utils/util"
import { isInChromeExtension } from "~/utils/browserUtil"

/**
 * 思源笔记配置
 * @author terwer
 */
export class SiYuanConfig {
  public readonly baseUrl
  public readonly token
  public readonly middlewareUrl

  constructor(baseUrl: string, token: string, middlewareUrl: string) {
    this.baseUrl = baseUrl
    this.token = token
    this.middlewareUrl = middlewareUrl
  }
}

/**
 * 获取思源笔记配置，优先级如下：
 * <p>1.本地保存的配置的值</p>
 * <P>2.启动环境变量</P>
 * @author terwer
 * @since 0.6.0
 */
export const getSiyuanCfg = (): SiYuanConfig => {
  let baseUrl = getEnv("VITE_SIYUAN_API_URL") ?? "" // Base Url
  let token = getEnv("VITE_SIYUAN_CONFIG_TOKEN") ?? "" // API token, 无需填写
  let middlewareUrl = getEnv("VITE_MIDDLEWARE_URL") ?? "" // 请求代理地址

  // 优先获取配置里面保存的数据
  const siyuanCfg = getJSONConf<SiYuanConfig>(SIYUAN_CONSTANTS.SIYUAN_CFG_KEY)
  if (!isEmptyString(siyuanCfg.baseUrl)) {
    baseUrl = siyuanCfg.baseUrl
  }
  if (!isEmptyString(siyuanCfg.token)) {
    token = siyuanCfg.token
  }
  if (!isEmptyString(siyuanCfg.middlewareUrl)) {
    middlewareUrl = siyuanCfg.middlewareUrl
  }

  // 如果配置没数据，给默认值
  if (isEmptyString(baseUrl)) {
    if (isInChromeExtension() || envUtil.isDev) {
      baseUrl = "http://127.0.0.1:6806"
    } else {
      baseUrl = window.location.protocol + "//" + window.location.host
    }
  }
  if (isEmptyString(token)) {
    token = ""
  }
  if (isEmptyString(middlewareUrl)) {
    middlewareUrl = "https://api.terwer.space/api/middleware"
  }

  return new SiYuanConfig(baseUrl, token, middlewareUrl)
}
