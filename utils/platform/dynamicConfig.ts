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

import { CONSTANTS } from "~/utils/constants/constants"
import { getJSONConf, setJSONConf } from "~/utils/configUtil"
import { isEmptyString } from "~/utils/util"
import { newID } from "~/utils/idUtil"
import { appendStr, upperFirst } from "~/utils/strUtil"
import { YamlConvertAdaptor } from "~/utils/platform/yamlConvertAdaptor"
import { LogFactory } from "~/utils/logUtil"
import { VuepressYamlConvertAdaptor } from "~/utils/platform/github/vuepress/VuepressYamlConvertAdaptor"
import { JekyllYamlConverterAdaptor } from "~/utils/platform/github/jekyll/JekyllYamlConverterAdaptor"
import { HugoYamlConverterAdaptor } from "~/utils/platform/github/hugo/HugoYamlConverterAdaptor"
import { HexoYamlConverterAdaptor } from "~/utils/platform/github/hexo/hexoYamlConverterAdaptor"
import { VitepressYamlConverterAdaptor } from "~/utils/platform/github/other/VitepressYamlConverterAdaptor"
import { NuxtYamlConverterAdaptor } from "~/utils/platform/github/other/NuxtYamlConverterAdaptor"
import { NextYamlConvertAdaptor } from "~/utils/platform/github/other/NextYamlConvertAdaptor"

const logger = LogFactory.getLogger("utils/platform/dynamicConfig.ts")

export class DynamicConfig {
  /**
   * 用于文章绑定的临时变量
   */
  posid?: any
  /**
   * 用于平台开关的临时变量
   */
  modelValue?: any
  /**
   * 动态平台类型(通用类型)
   */
  platformType: PlatformType
  /**
   * 子平台类型(细分子类型)
   * @since 0.1.0+
   */
  subPlatformType?: SubPlatformType
  /**
   * 平台Key
   */
  platformKey: string
  /**
   * 平台名称
   */
  platformName: string
  /**
   * YAML转换器
   */
  yamlConverter?: YamlConvertAdaptor

  constructor(platformType: PlatformType, platformKey: string, platformName: string) {
    this.platformType = platformType
    this.platformKey = platformKey
    this.platformName = platformName
  }
}

/**
 * 动态平台类型枚举
 */
export enum PlatformType {
  /**
   * Metaweblog
   */
  Metaweblog = "Metaweblog",
  /**
   * WordPress
   */
  Wordpress = "Wordpress",
  /**
   * GitHub(Hugo、Hexo、Jekyll、Vuepress、Vitepress、Nuxt content、Next.js)
   */
  Github = "Github",
  /**
   * 自定义
   */
  Custom = "Custom",
}

/**
 * 平台子类型
 * @since 0.1.0+
 * @author terwer
 */
export enum SubPlatformType {
  Github_Hugo = "Hugo",
  Github_Hexo = "Hexo",
  Github_Jekyll = "Jekyll",
  // Github_giteePages = "giteePages",
  // Github_codingPages = "codingPages",
  Github_Vuepress = "Vuepress",
  Github_Vitepress = "Vitepress",
  Github_Nuxt = "Nuxt",
  Github_Next = "Next",
  NONE = "none",
}

/**
 * 动态配置类型封装
 */
export interface DynamicJsonCfg {
  totalCfg: DynamicConfig[]
  githubCfg: DynamicConfig[]
  metaweblogCfg: DynamicConfig[]
  wordpressCfg: DynamicConfig[]
}

/**
 * 获取子平台列表
 */
export function getSubtypeList(ptype: PlatformType): SubPlatformType[] {
  const subtypeList: SubPlatformType[] = []

  switch (ptype) {
    case PlatformType.Github:
      subtypeList.push(SubPlatformType.Github_Hugo)
      subtypeList.push(SubPlatformType.Github_Hexo)
      subtypeList.push(SubPlatformType.Github_Jekyll)
      // subtypeList.push(SubPlatformType.Github_giteePages)
      // subtypeList.push(SubPlatformType.Github_codingPages)
      subtypeList.push(SubPlatformType.Github_Vuepress)
      subtypeList.push(SubPlatformType.Github_Vitepress)
      subtypeList.push(SubPlatformType.Github_Nuxt)
      subtypeList.push(SubPlatformType.Github_Next)
      break
    default:
      break
  }

  return subtypeList
}

/**
 * 获取动态平台JSON配置
 */
export function getDynamicJsonCfg(): DynamicJsonCfg {
  return getJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY)
}

/**
 * 设置动态平台JSON配置
 * @param dynamicConfigArray
 */
export function setDynamicJsonCfg(dynamicConfigArray: DynamicConfig[]): void {
  const totalCfg: DynamicConfig[] = dynamicConfigArray
  const githubCfg: DynamicConfig[] = []
  const metaweblogCfg: DynamicConfig[] = []
  const wordpressCfg: DynamicConfig[] = []

  // 按照类型组装便于后面数据使用
  totalCfg.forEach((item) => {
    switch (item.platformType) {
      case PlatformType.Github:
        githubCfg.push(item)
        break
      case PlatformType.Metaweblog:
        metaweblogCfg.push(item)
        break
      case PlatformType.Wordpress:
        wordpressCfg.push(item)
        break
      default:
        break
    }
  })

  const dynamicJsonCfg: DynamicJsonCfg = {
    totalCfg,
    githubCfg,
    metaweblogCfg,
    wordpressCfg,
  }

  setJSONConf<DynamicJsonCfg>(CONSTANTS.DYNAMIC_CONFIG_KEY, dynamicJsonCfg)
}

// =====================
// 动态平台key规则
// =====================
/**
 * 生成新的平台key
 * 平台与ID之间用-分割
 * 平台与子平台直接用_分割
 * @param ptype 平台类型
 * @param subtype 子平台类型
 */
export function getNewPlatformKey(ptype: PlatformType, subtype: SubPlatformType): string {
  let ret
  const newId = newID()
  ret = ptype.toLowerCase()

  if (!isEmptyString(subtype) && SubPlatformType.NONE !== subtype) {
    ret = appendStr(ret, upperFirst(subtype))
  }
  return appendStr(ret, "-", newId)
}

/**
 * 检测动态平台key是否重复
 */
export function isDynamicKeyExists(dynamicConfigArray: DynamicConfig[], key: string): boolean {
  let flag = false
  // logUtil.logInfo("isDynamicKeyExists,dynamicConfigArray=>")
  // logUtil.logInfo(dynamicConfigArray)
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey === key) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * 生成默认的平台名
 * @param ptype 平台
 * @param subtype 子平台
 * @param isShowSubtype 是否显示子平台
 */
export function getDefaultPlatformName(ptype: PlatformType, subtype: SubPlatformType, isShowSubtype: boolean): string {
  if (PlatformType.Github === ptype && SubPlatformType.NONE === subtype) {
    return ""
  }

  let pname: string = ptype
  if (isShowSubtype) {
    pname = subtype
  }
  pname = pname + "-1"
  return pname
}

// =====================
// 动态平台开关key规则
// =====================
interface SwitchItem {
  switchKey: string
  switchValue: boolean
}

export function getDynSwitchKey(platformKey: string): string {
  return "switch-" + platformKey
}

/**
 * 平台开关启用状态值
 * @param platformKey
 */
export function getDynSwitchActive(platformKey: string): string {
  return platformKey + "_true"
}

/**
 * 平台开关禁用状态值
 * @param platformKey
 */
export function getDynSwitchInactive(platformKey: string): string {
  return platformKey + "_false"
}

/**
 * 组装Switch显示值
 * @param switchItem 开关
 */
export function getDynSwitchModelValue(switchItem: SwitchItem): string {
  return switchItem.switchKey + "_" + switchItem.switchValue.toString()
}

/**
 * 解析选中项
 * @param selectedText 选中的值
 */
export function getSwitchItem(selectedText: string): SwitchItem {
  const valArr = selectedText.split("_")
  const switchKey = getDynSwitchKey(valArr[0])
  const switchStatus = valArr[1] === "true"

  return {
    switchKey,
    switchValue: switchStatus,
  }
}

// =====================
// 动态平台文章ID规则
// =====================
/**
 * 获取动态文章ID的key
 * @param platformKey
 */
export function getDynPostidKey(platformKey: string): string {
  return "custom-" + platformKey + "-post-id"
}

// ======================
// 动态平台Object对象初始化
// ======================
/**
 * 根据平台key获取YAML转换器
 * @param platformKey
 */
export const getDynYamlConverterAdaptor = (platformKey: string): YamlConvertAdaptor => {
  let yamlConverter = new YamlConvertAdaptor()
  if (platformKey.includes("-")) {
    const typeArr = platformKey.split("-")
    if (typeArr.length > 0) {
      const ptype = typeArr[0].toLowerCase()

      if (ptype.includes(SubPlatformType.Github_Vuepress.toLowerCase())) {
        yamlConverter = new VuepressYamlConvertAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Hugo.toLowerCase())) {
        yamlConverter = new HugoYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Hexo.toLowerCase())) {
        yamlConverter = new HexoYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Jekyll.toLowerCase())) {
        yamlConverter = new JekyllYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Vitepress.toLowerCase())) {
        yamlConverter = new VitepressYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Nuxt.toLowerCase())) {
        yamlConverter = new NuxtYamlConverterAdaptor()
      } else if (ptype.includes(SubPlatformType.Github_Next.toLowerCase())) {
        yamlConverter = new NextYamlConvertAdaptor()
      }
    }
  }

  return yamlConverter
}
