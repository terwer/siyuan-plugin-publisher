/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { StrUtil } from "zhi-common"
import sypIdUtil from "~/src/utils/sypIdUtil.ts"

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
   * 平台描述，用于平台选择、账号列表、配置决策等需要理解平台用途的入口。
   *
   * 运行时可由 i18n.description 翻译得到；已保存的历史配置也可能直接携带该字段。
   *
   * @since 1.41.1+
   */
  description?: string

  /**
   * 平台展示字段的国际化 key 映射。
   *
   * key 是目标字段名，例如 description / platformName / tooltip；value 是 i18n key。
   * 预置数据只维护 i18n key，显示层统一本地化到对应目标字段。
   *
   * @since 1.41.1+
   */
  i18n?: Record<string, string>

  /**
   * V2 展示排序，仅用于账号列表和快速发布的展示顺序。
   *
   * 数字越小越靠前；不代表发布执行顺序，也不影响授权、配置或发布校验。
   *
   * @since 1.41.1+
   */
  displayOrder?: number

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
   *  取消登录地址，网页授权需要
   */
  logoutUrl?: string

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

  /**
   * 额外脚本，用于自定义平台，例如：小红书
   *
   * @author terwer
   * @since 1.32.0
   */
  extraScript?: string

  constructor(
    platformType: PlatformType,
    platformKey: string,
    platformName: string,
    subPlatformType?: SubPlatformType,
    platformIcon?: string,
    description?: string,
    i18n?: Record<string, string>
  ) {
    this.platformType = platformType
    this.platformKey = platformKey
    this.platformName = platformName
    this.isAuth = false
    this.isEnabled = false
    this.authMode = AuthMode.API
    if (platformKey.toLowerCase().includes(PlatformType.Custom.toString().toLowerCase())) {
      this.authMode = AuthMode.WEBSITE
    }
    this.cookieLimit = false
    this.isSys = false

    this.subPlatformType = subPlatformType
    this.platformIcon = platformIcon
    this.description = description
    this.i18n = i18n
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
   * 文件系统
   */
  Fs = "Fs",

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
  Common_Halo = "Halo",
  Common_Telegraph = "Telegraph",
  Common_Confluence = "Confluence",

  // Github 子平台
  Github_Hexo = "Hexo",
  Github_Hugo = "Hugo",
  Github_Jekyll = "Jekyll",
  Github_Quartz = "Quartz",
  Github_Vuepress = "Vuepress",
  Github_Vuepress2 = "Vuepress2",
  Github_Vitepress = "Vitepress",
  Github_Astro = "Astro",
  
    Github_Docsify = "Docsify",

  // Gitlab 子平台
  Gitlab_Hexo = "Gitlabhexo",
  Gitlab_Hugo = "Gitlabhugo",
  Gitlab_Jekyll = "Gitlabjekyll",
  Gitlab_Vuepress = "Gitlabvuepress",
  Gitlab_Vuepress2 = "Gitlabvuepress2",
  Gitlab_Vitepress = "Gitlabvitepress",
  Gitlab_Astro = "Gitlabastro",
  
    Gitlab_Docsify = "Gitlabdocsify",

  // Metaweblog
  Metaweblog_Metaweblog = "Metaweblog",
  Metaweblog_Cnblogs = "Cnblogs",
  Metaweblog_Typecho = "Typecho",
  Metaweblog_Jvue = "Jvue",

  // WordPress
  Wordpress_Wordpress = "Wordpress",
  Wordpress_Wordpressdotcom = "Wordpressdotcom",

  // Custom
  Custom_Zhihu = "Zhihu",
  Custom_CSDN = "Csdn",
  Custom_Wechat = "Wechat",
  Custom_Jianshu = "Jianshu",
  Custom_Juejin = "Juejin",
  // Custom_Flowus = "Flowus",
  Custom_Haloweb = "Haloweb",
  Custom_Yuqueweb = "Yuqueweb",
  Custom_Bilibili = "Bilibili",
  Custom_Xiaohongshu = "Xiaohongshu",

  // Fs
  Fs_LocalSystem = "LocalSystem",
  Fs_Ftp = "Ftp",
  Fs_Sftp = "Sftp",
  Fs_BaiduNetDisk = "BaiduNetDisk",
  Fs_AliyunDrive = "AliyunDrive",
  Fs_Weiyun = "Weiyun",
  Fs_Doubao = "Doubao",
  Fs_OneDrive = "OneDrive",
  Fs_GoogleDrive = "GoogleDrive",
  Fs_Quark = "Quark",

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
  fsCfg: DynamicConfig[]
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
      subtypeList.push(SubPlatformType.Common_Halo)
      subtypeList.push(SubPlatformType.Common_Telegraph)
      subtypeList.push(SubPlatformType.Common_Confluence)
      break
    case PlatformType.Github:
      subtypeList.push(SubPlatformType.Github_Hexo)
      subtypeList.push(SubPlatformType.Github_Hugo)
      subtypeList.push(SubPlatformType.Github_Jekyll)
      subtypeList.push(SubPlatformType.Github_Quartz)
      subtypeList.push(SubPlatformType.Github_Vuepress)
      subtypeList.push(SubPlatformType.Github_Vuepress2)
      subtypeList.push(SubPlatformType.Github_Vitepress)
      subtypeList.push(SubPlatformType.Github_Astro)
      subtypeList.push(SubPlatformType.Github_Docsify)
      break
    case PlatformType.Gitlab:
      subtypeList.push(SubPlatformType.Gitlab_Hexo)
      subtypeList.push(SubPlatformType.Gitlab_Hugo)
      subtypeList.push(SubPlatformType.Gitlab_Jekyll)
      subtypeList.push(SubPlatformType.Gitlab_Vuepress)
      subtypeList.push(SubPlatformType.Gitlab_Vuepress2)
      subtypeList.push(SubPlatformType.Gitlab_Vitepress)
      subtypeList.push(SubPlatformType.Gitlab_Astro)
      subtypeList.push(SubPlatformType.Gitlab_Docsify)
      break
    case PlatformType.Metaweblog:
      subtypeList.push(SubPlatformType.Metaweblog_Metaweblog)
      subtypeList.push(SubPlatformType.Metaweblog_Cnblogs)
      subtypeList.push(SubPlatformType.Metaweblog_Typecho)
      subtypeList.push(SubPlatformType.Metaweblog_Jvue)
      break
    case PlatformType.Wordpress:
      subtypeList.push(SubPlatformType.Wordpress_Wordpress)
      subtypeList.push(SubPlatformType.Wordpress_Wordpressdotcom)
      break
    case PlatformType.Custom:
      subtypeList.push(SubPlatformType.Custom_Zhihu)
      subtypeList.push(SubPlatformType.Custom_CSDN)
      subtypeList.push(SubPlatformType.Custom_Wechat)
      subtypeList.push(SubPlatformType.Custom_Jianshu)
      subtypeList.push(SubPlatformType.Custom_Juejin)
      // subtypeList.push(SubPlatformType.Custom_Flowus)
      subtypeList.push(SubPlatformType.Custom_Haloweb)
      subtypeList.push(SubPlatformType.Custom_Yuqueweb)
      subtypeList.push(SubPlatformType.Custom_Bilibili)
      subtypeList.push(SubPlatformType.Custom_Xiaohongshu)
      break
    case PlatformType.Fs:
      subtypeList.push(SubPlatformType.Fs_LocalSystem)
      subtypeList.push(SubPlatformType.Fs_Ftp)
      subtypeList.push(SubPlatformType.Fs_Sftp)
      subtypeList.push(SubPlatformType.Fs_BaiduNetDisk)
      subtypeList.push(SubPlatformType.Fs_AliyunDrive)
      subtypeList.push(SubPlatformType.Fs_Weiyun)
      subtypeList.push(SubPlatformType.Fs_Doubao)
      subtypeList.push(SubPlatformType.Fs_OneDrive)
      subtypeList.push(SubPlatformType.Fs_GoogleDrive)
      subtypeList.push(SubPlatformType.Fs_Quark)
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
  const fsCfg: DynamicConfig[] = []
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
      case PlatformType.Fs:
        fsCfg.push(item)
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
    fsCfg,
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
  const newId = sypIdUtil.newID()
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
 *
 * 匹配顺序：精确 → 大小写不敏感 → 规范化（忽略大小写、剥离实例 id），
 * 以兼容历史数据（旧版插件写入的全小写 key、不带实例 id）与当前平台配置（混合大小写 platformKey、可能带实例 id）的差异，
 * 避免文章管理「平台显示已删除」。
 */
export function getDynCfgByKey(dynamicConfigArray: DynamicConfig[], key: string): DynamicConfig {
  if (!key) {
    return null
  }
  // 1. 精确匹配
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey === key) {
      return dynamicConfigArray[i]
    }
  }
  // 2. 大小写不敏感匹配（保留实例 id）
  const lowerKey = key.toLowerCase()
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (dynamicConfigArray[i].platformKey.toLowerCase() === lowerKey) {
      return dynamicConfigArray[i]
    }
  }
  // 3. 规范化匹配（忽略大小写 + 剥离实例 id）
  const normKey = normalizePlatformKey(key)
  for (let i = 0; i < dynamicConfigArray.length; i++) {
    if (normalizePlatformKey(dynamicConfigArray[i].platformKey) === normKey) {
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

/**
 * 规范化平台 key，用于消除「历史数据 key」与「当前平台配置 platformKey」的差异：
 * - 剥离尾部实例 id（由 getNewPlatformKey 生成，格式 `-<短字母数字>`）
 * - 统一分隔符 `-` 为 `_`
 * - 全部转为小写
 *
 * 例如：
 * - `fs_LocalSystem` / `fs-localsystem` -> `fs_localsystem`
 * - `custom_Yuqueweb-z1awjla` / `custom-yuqueweb-z1awjla` -> `custom_yuqueweb`
 * - `wordpress_Wordpressdotcom` -> `wordpress_wordpressdotcom`
 *
 * @since 1.41.1+
 */
export function normalizePlatformKey(key: string): string {
  const normalized = key.replace(/-/g, "_").toLowerCase()
  // 仅当剥离尾部 <id> 后剩余仍为 <type>_<subtype>（含 '_'）时才剥离，
  // 以免把无实例 id 的纯 <type>-<subtype> 形态误判为 id 而过度剥离。
  const stripped = normalized.replace(/_[a-z0-9]{4,}$/, "")
  return stripped.includes("_") ? stripped : normalized
}

/**
 * 获取元数据 key
 *
 * @param postidKey 文章 key
 */
export function getDynPlatformKeyFromPostidKey(postidKey: string): string {
  // 匹配postidKey的正则表达式
  const regex = /^custom-(.+?)-post-id$/
  const match = postidKey.match(regex)
  if (match && match[1]) {
    // 提取platformKey
    const platformKey = match[1]
    return platformKey
  } else {
    throw new Error("Invalid postidKey format")
  }
}
