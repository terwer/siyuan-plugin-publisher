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

import idUtil from "~/src/utils/idUtil.ts"
import { StrUtil } from "zhi-common"

export class DynamicConfig {
  /**
   * 动态平台类型(通用类型)
   */
  platformType: PlatformType

  /**
   * 子平台类型(细分子类型)
   *
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
   * 平台图标(svg代码)
   *
   * @since 0.9.0+
   */
  platformIcon?: string

  /**
   * 是否授权
   */
  isEnabled: boolean

  /**
   * 是否授权
   */
  isAuth: boolean

  /**
   * 授权模式
   */
  authMode: AuthMode

  /**
   * 登录地址，网页授权需要
   */
  authUrl?: string

  /**
   * 域名
   */
  domain?: string

  /**
   * cookie现在
   */
  cookieLimit?: boolean

  /**
   * 是否内置
   */
  isSys: boolean

  constructor(
    platformType: PlatformType,
    platformKey: string,
    platformName: string,
    subPlatformType?: SubPlatformType,
    platformIcon?: string
  ) {
    this.platformType = platformType
    this.platformKey = platformKey
    this.platformName = platformName
    this.isAuth = false
    this.isEnabled = false
    this.authMode = AuthMode.API
    this.cookieLimit = false
    this.isSys = false

    this.subPlatformType = subPlatformType
    this.platformIcon = platformIcon
  }
}

/**
 * 授权模式
 */
export enum AuthMode {
  API = "api",
  WEBSITE = "web",
}

/**
 * 动态平台类型枚举
 */
export enum PlatformType {
  /**
   * 通用平台(Yuque)
   */
  Common = "Common",

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
   * Gitlab
   */
  Gitlab = "Gitlab",

  /**
   * 自定义(zhihu)
   */
  Custom = "Custom",

  /**
   * 内置平台，仅内部使用，用户不能使用也不能更改(Siyuan)
   */
  System = "System",
}

/**
 * 平台子类型
 *
 * @since 0.1.0+
 * @author terwer
 */
export enum SubPlatformType {
  // Common
  Common_Yuque = "Yuque",
  Common_Notion = "Notion",

  // Github 子平台
  Github_Hexo = "Hexo",
  Github_Hugo = "Hugo",
  Github_Jekyll = "Jekyll",
  Github_Vuepress = "Vuepress",
  Github_Vuepress2 = "Vuepress2",
  Github_Vitepress = "Vitepress",

  // Gitlab 子平台
  Gitlab_Hexo = "Gitlabhexo",
  Gitlab_Hugo = "Gitlabhugo",
  Gitlab_Jekyll = "Gitlabjekyll",
  Gitlab_Vuepress = "Gitlabvuepress",
  Gitlab_Vuepress2 = "Gitlabvuepress2",
  Gitlab_Vitepress = "Gitlabvitepress",

  // Metaweblog
  Metaweblog_Metaweblog = "Metaweblog",
  Metaweblog_Cnblogs = "Cnblogs",
  Metaweblog_Typecho = "Typecho",

  // WordPress
  Wordpress_Wordpress = "Wordpress",

  // Custom
  Custom_Zhihu = "Zhihu",
  Custom_CSDN = "Csdn",
  Custom_Wechat = "Wechat",
  Custom_Jianshu = "Jianshu",
  Custom_Juejin = "Juejin",

  // System
  System_Siyuan = "Siyuan",

  NONE = "none",
}

/**
 * 动态配置类型封装
 */
export interface DynamicJsonCfg {
  totalCfg: DynamicConfig[]
  commonCfg: DynamicConfig[]
  githubCfg: DynamicConfig[]
  gitlabCfg: DynamicConfig[]
  metaweblogCfg: DynamicConfig[]
  wordpressCfg: DynamicConfig[]
  customCfg: DynamicConfig[]
  systemCfg: DynamicConfig[]
}

/**
 * 获取子平台列表
 */
export function getSubtypeList(ptype: PlatformType): SubPlatformType[] {
  const subtypeList: SubPlatformType[] = []

  switch (ptype) {
    case PlatformType.Common:
      subtypeList.push(SubPlatformType.Common_Yuque)
      subtypeList.push(SubPlatformType.Common_Notion)
      break
    case PlatformType.Github:
      subtypeList.push(SubPlatformType.Github_Hexo)
      subtypeList.push(SubPlatformType.Github_Hugo)
      subtypeList.push(SubPlatformType.Github_Jekyll)
      subtypeList.push(SubPlatformType.Github_Vuepress)
      subtypeList.push(SubPlatformType.Github_Vuepress2)
      subtypeList.push(SubPlatformType.Github_Vitepress)
      break
    case PlatformType.Gitlab:
      subtypeList.push(SubPlatformType.Gitlab_Hexo)
      subtypeList.push(SubPlatformType.Gitlab_Hugo)
      subtypeList.push(SubPlatformType.Gitlab_Jekyll)
      subtypeList.push(SubPlatformType.Gitlab_Vuepress)
      subtypeList.push(SubPlatformType.Gitlab_Vuepress2)
      subtypeList.push(SubPlatformType.Gitlab_Vitepress)
      break
    case PlatformType.Metaweblog:
      subtypeList.push(SubPlatformType.Metaweblog_Metaweblog)
      subtypeList.push(SubPlatformType.Metaweblog_Cnblogs)
      subtypeList.push(SubPlatformType.Metaweblog_Typecho)
      break
    case PlatformType.Wordpress:
      subtypeList.push(SubPlatformType.Wordpress_Wordpress)
      break
    case PlatformType.Custom:
      subtypeList.push(SubPlatformType.Custom_Zhihu)
      subtypeList.push(SubPlatformType.Custom_CSDN)
      subtypeList.push(SubPlatformType.Custom_Wechat)
      subtypeList.push(SubPlatformType.Custom_Jianshu)
      subtypeList.push(SubPlatformType.Custom_Juejin)
      break
    case PlatformType.System:
      subtypeList.push(SubPlatformType.System_Siyuan)
      break
    default:
      break
  }

  return subtypeList
}

/**
 * 设置动态平台JSON配置
 *
 * @param dynamicConfigArray
 */
export function setDynamicJsonCfg(dynamicConfigArray: DynamicConfig[]): DynamicJsonCfg {
  const totalCfg: DynamicConfig[] = dynamicConfigArray
  const commonCfg: DynamicConfig[] = []
  const githubCfg: DynamicConfig[] = []
  const gitlabCfg: DynamicConfig[] = []
  const metaweblogCfg: DynamicConfig[] = []
  const wordpressCfg: DynamicConfig[] = []
  const customCfg: DynamicConfig[] = []
  const systemCfg: DynamicConfig[] = []

  // 按照类型组装便于后面数据使用
  totalCfg.forEach((item) => {
    switch (item.platformType) {
      case PlatformType.Common:
        commonCfg.push(item)
        break
      case PlatformType.Github:
        githubCfg.push(item)
        break
      case PlatformType.Gitlab:
        gitlabCfg.push(item)
        break
      case PlatformType.Metaweblog:
        metaweblogCfg.push(item)
        break
      case PlatformType.Wordpress:
        wordpressCfg.push(item)
        break
      case PlatformType.Custom:
        customCfg.push(item)
        break
      case PlatformType.System:
        systemCfg.push(item)
        break
      default:
        break
    }
  })

  const dynamicJsonCfg: DynamicJsonCfg = {
    totalCfg,
    commonCfg,
    githubCfg,
    gitlabCfg,
    metaweblogCfg,
    wordpressCfg,
    customCfg,
    systemCfg,
  }

  return dynamicJsonCfg
}

// =====================
// 动态平台key规则
// =====================
export function getSubPlatformTypeByKey(key: string): SubPlatformType {
  const keyParts = key.split("-")
  let subtype = ""

  if (keyParts.length > 0) {
    const subPlatformParts = keyParts[0].split("_")
    subtype = subPlatformParts.length > 1 ? subPlatformParts[1] : subPlatformParts[0]
  } else {
    throw new Error("Invalid platform key")
  }

  const enumValues = Object.values(SubPlatformType)
  const foundType = enumValues.find(
    (value) => typeof value === "string" && value.toLowerCase() === subtype.toLowerCase()
  )

  if (foundType) {
    return foundType as SubPlatformType
  }

  throw new Error("Invalid platform key")
}

/**
 * 生成新的平台key
 *
 * 平台与ID之间用-分割
 * 平台与子平台直接用_分割
 * @param ptype 平台类型
 * @param subtype 子平台类型
 */
export function getNewPlatformKey(ptype: PlatformType, subtype: SubPlatformType): string {
  let ret: any
  const newId = idUtil.newID()
  ret = ptype.toLowerCase()

  if (!StrUtil.isEmptyString(subtype) && SubPlatformType.NONE !== subtype) {
    ret = [ret, "_", StrUtil.upperFirst(subtype)].join("")
  }
  return [ret, "-", newId].join("")
}

/**
 * 检测动态平台key是否重复
 */
export function isDynamicKeyExists(dynamicConfigArray: DynamicConfig[], key: string): boolean {
  let flag = false
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey === key) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * 通过平台key查询平台
 */
export function getDynCfgByKey(dynamicConfigArray: DynamicConfig[], key: string): DynamicConfig {
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey === key) {
      return dynamicConfigArray[i]
    }
  }
  return null
}

/**
 * 根据平台key替换平台配置
 *
 * @param dynamicConfigArray 动态配置数组
 * @param key 平台key
 * @param newConfig 新的平台配置
 * @returns 替换后的动态配置数组
 */
export function replacePlatformByKey(
  dynamicConfigArray: DynamicConfig[],
  key: string,
  newConfig: DynamicConfig
): DynamicConfig[] {
  const newArray = [...dynamicConfigArray]
  for (let i = 0; i < newArray.length; i++) {
    if (newArray[i].platformKey === key) {
      newArray[i] = newConfig
      break
    }
  }
  return newArray
}

/**
 * 从dynamicConfigArray数组中删除匹配给定key的元素
 *
 * @param dynamicConfigArray - 要删除元素的数组
 * @param key - 要匹配的键
 * @returns 删除元素后的新数组
 */
export function deletePlatformByKey(dynamicConfigArray: any[], key: string): any[] {
  return dynamicConfigArray.filter((item) => item.platformKey !== key)
}

/**
 * 获取动态文章ID的key
 *
 * @param platformKey
 */
export function getDynPostidKey(platformKey: string): string {
  return "custom-" + platformKey + "-post-id"
}

/**
 * 获取动态YAML的key
 *
 * @param platformKey
 */
export function getDynYamlKey(platformKey: string): string {
  return "custom-" + platformKey.replace(/_/g, "-") + "-yaml"
}
