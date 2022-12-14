/*
 * Copyright (c) 2022, Terwer . All rights reserved.
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

import {
  DynamicConfig,
  getDynamicJsonCfg,
  isDynamicKeyExists,
  PlatformType,
  setDynamicJsonCfg,
  SubPlatformType,
} from "~/utils/platform/dynamicConfig"
import { checkKeyExists } from "~/utils/configUtil"
import * as pre from "./pre.json"
import { LogFactory } from "~/utils/logUtil"

const logger = LogFactory.getLogger("utils/import/importUtil.ts")

/**
 * 检测唯一性
 * @param pkey
 * @param dynamicConfigArray
 */
const checkPlatform = (pkey: string, dynamicConfigArray: DynamicConfig[]) => {
  if (isDynamicKeyExists(dynamicConfigArray, pkey)) {
    return false
  }

  // 保证开关变量key不重复
  const switchKey = "switch-" + pkey
  const postidKey = "custom-" + pkey + "-post-id"
  // 保证文章绑定id的key不重复
  return !(
    checkKeyExists(pkey) ||
    checkKeyExists(switchKey) ||
    checkKeyExists(postidKey)
  )
}

/**
 * 生成新平台
 * @param ptype
 * @param platformKey
 * @param platformName
 * @param subtype
 */
const genNewPlatform = (
  ptype: PlatformType,
  platformKey: string,
  platformName: string,
  subtype?: SubPlatformType
) => {
  const newCfg = new DynamicConfig(ptype, platformKey, platformName)
  newCfg.subPlatformType = subtype
  return newCfg
}

/**
 * 导入预定义平台
 */
export const importPreDefinedPlatform = () => {
  const dynamicConfigArray = getDynamicJsonCfg().totalCfg || []

  // github
  if (pre.githubCfg && pre.githubCfg.length > 0) {
    pre.githubCfg.forEach((gcfg) => {
      // 防止重复导入
      if (checkPlatform(gcfg.platformKey, dynamicConfigArray)) {
        const newCfg = genNewPlatform(
          PlatformType[gcfg.platformType],
          gcfg.platformKey,
          gcfg.platformName,
          SubPlatformType[gcfg.subPlatformType]
        )

        dynamicConfigArray.push(newCfg)

        // const switchKey = "switch-" + gcfg.platformType
        // setBooleanConf(switchKey, false)
      }
    })
  }

  // metaweblog
  if (pre.metaweblogCfg && pre.metaweblogCfg.length > 0) {
    pre.metaweblogCfg.forEach((mcfg) => {
      // 防止重复导入
      if (checkPlatform(mcfg.platformKey, dynamicConfigArray)) {
        const newCfg = genNewPlatform(
          PlatformType[mcfg.platformType],
          mcfg.platformKey,
          mcfg.platformName,
          SubPlatformType.NONE
        )

        dynamicConfigArray.push(newCfg)

        // const switchKey = "switch-" + gcfg.platformType
        // setBooleanConf(switchKey, false)
      }
    })
  }

  // WordPress
  if (pre.wordpressCfg && pre.wordpressCfg.length > 0) {
    pre.wordpressCfg.forEach((wcfg) => {
      // 防止重复导入
      if (checkPlatform(wcfg.platformKey, dynamicConfigArray)) {
        const newCfg = genNewPlatform(
          PlatformType[wcfg.platformType],
          wcfg.platformKey,
          wcfg.platformName,
          SubPlatformType.NONE
        )

        dynamicConfigArray.push(newCfg)

        // const switchKey = "switch-" + gcfg.platformType
        // setBooleanConf(switchKey, false)
      }
    })
  }

  logger.debug("将要导入预定义平台：", dynamicConfigArray)
  setDynamicJsonCfg(dynamicConfigArray)
}
