/*
 * Copyright (c) 2023-2024, Terwer . All rights reserved.
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

import { DEFAULT_SIYUAN_LANG, DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"

interface DYNAMIC_CONFIG_TYPE {
  totalCfg: DynamicConfig[]
  commonCfg: DynamicConfig[]
  metaweblogCfg: DynamicConfig[]
  wordpressCfg: DynamicConfig[]
  githubCfg: DynamicConfig[]
  gitlabCfg: DynamicConfig[]
  customCfg: DynamicConfig[]
  systemCfg: DynamicConfig[]
}

interface ISypConfig {
  lang?: "zh_CN" | "en_US"
  currentPlatform?: DynamicConfig | null

  // 平台总的集合
  [DYNAMIC_CONFIG_KEY]?: DYNAMIC_CONFIG_TYPE

  // [平台key1]: {平台配置1}
  // [平台key2]: {平台配置2}

  // [siyuan文档ID]: {
  //  [custom-slug]: 初始化生成，初始化可读取siyuan属性，但是之后不能再修改
  //  [动态平台1postid的key]: 对应平台的文章ID
  //  [动态平台2postid的key]: 对应平台的文章ID
  // }

  [key: string]: any
}

/**
 * 核心发布配置
 *
 * @author terwer
 * @version 2.0.0
 * @since 0.8.0
 */
class SypConfig implements ISypConfig {
  lang?: "zh_CN" | "en_US";

  // 动态配置
  [DYNAMIC_CONFIG_KEY]?: DYNAMIC_CONFIG_TYPE

  constructor() {
    this.lang = DEFAULT_SIYUAN_LANG as "zh_CN" | "en_US"
    this[DYNAMIC_CONFIG_KEY] = {} as any
  }
}

export { SypConfig }
