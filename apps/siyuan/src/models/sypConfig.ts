/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { BLOG_CONFIG_KEY, DEFAULT_SIYUAN_LANG, DYNAMIC_CONFIG_KEY } from "@/Constants.ts"
import { DynamicConfig } from "@/models/dynamicConfig.ts"
import { BlogConfig } from "zhi-blog-api"

export interface DYNAMIC_CONFIG_TYPE {
  totalCfg: DynamicConfig[]
  commonCfg: DynamicConfig[]
  metaweblogCfg: DynamicConfig[]
  wordpressCfg: DynamicConfig[]
  githubCfg: DynamicConfig[]
  gitlabCfg: DynamicConfig[]
  customCfg: DynamicConfig[]
  systemCfg: DynamicConfig[]
}

export interface BLOG_CONFIG_TYPE {
  [key: string]: Record<string, any>
}

interface ISypConfig {
  lang?: "zh_CN" | "en_US"

  // 平台配置集合
  [DYNAMIC_CONFIG_KEY]?: DYNAMIC_CONFIG_TYPE

  // 博客配置集合
  // @deprecated since 2.0.0
  // [平台key1]: {平台配置1}
  // [平台key2]: {平台配置2}
  [BLOG_CONFIG_KEY]?: BLOG_CONFIG_TYPE

  // 文档信息集合
  // [siyuan文档ID]: {
  //  [custom-slug]: 初始化生成，初始化可读取siyuan属性，但是之后不能再修改
  //  [动态平台1postid的key]: 对应平台的文章ID
  //  [动态平台2postid的key]: 对应平台的文章ID
  // }

  [key: string]:
    | BlogConfig
    | DYNAMIC_CONFIG_TYPE
    | BLOG_CONFIG_TYPE
    | "zh_CN"
    | "en_US"
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, unknown>
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
  [DYNAMIC_CONFIG_KEY]?: DYNAMIC_CONFIG_TYPE;
  // 博客配置
  [BLOG_CONFIG_KEY]?: BLOG_CONFIG_TYPE;

  [key: string]:
    | BlogConfig
    | DYNAMIC_CONFIG_TYPE
    | "zh_CN"
    | "en_US"
    | string
    | number
    | boolean
    | Record<string, unknown>
    | null
    | undefined

  constructor() {
    this.lang = DEFAULT_SIYUAN_LANG as "zh_CN" | "en_US"
    this[DYNAMIC_CONFIG_KEY] = {
      totalCfg: [],
      commonCfg: [],
      metaweblogCfg: [],
      wordpressCfg: [],
      githubCfg: [],
      gitlabCfg: [],
      customCfg: [],
      systemCfg: [],
    }
  }
}

export { SypConfig }
