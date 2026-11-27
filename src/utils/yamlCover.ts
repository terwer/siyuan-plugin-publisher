/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2026 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import type { BlogConfig } from "zhi-blog-api"
import { StrUtil, YamlUtil } from "zhi-common"

/**
 * 静态站平台默认使用的 Front Matter 封面字段名。
 */
export const DEFAULT_YAML_COVER_KEY = "cover"

/**
 * 支持把封面写入 YAML Front Matter 的平台配置形状。
 *
 * 这类平台的封面不是原生字段，而是主题读取的 Front Matter 键；发布层需要先把
 * 图片上传到平台图片仓库，再把平台可用地址写进 Front Matter。
 */
export interface YamlCoverCapableConfig {
  /**
   * 平台是否支持发布时设置 Front Matter 封面。
   */
  yamlCoverEnabled?: boolean
  /**
   * Front Matter 封面字段名，默认 cover。
   */
  yamlCoverKey?: string
}

/**
 * 平台是否声明了 Front Matter 封面能力。
 *
 * @param cfg - 平台配置
 */
export const isYamlCoverEnabled = (cfg?: BlogConfig): boolean => {
  return (cfg as YamlCoverCapableConfig | undefined)?.yamlCoverEnabled === true
}

/**
 * 读取 Front Matter 封面字段名，缺省为 cover。
 *
 * @param cfg - 平台配置
 */
export const getYamlCoverKey = (cfg?: BlogConfig): string => {
  const key = (cfg as YamlCoverCapableConfig | undefined)?.yamlCoverKey
  return typeof key === "string" && key.trim() !== "" ? key.trim() : DEFAULT_YAML_COVER_KEY
}

/**
 * YAML 预设配置里是否使用了 [cover] 占位符。
 *
 * 使用占位符时由用户显式决定封面写进哪个主题字段，发布层不再额外写默认 cover。
 *
 * @param raw - YAML 预设配置原文
 */
export const hasCoverPlaceholder = (raw?: string): boolean => {
  return typeof raw === "string" && raw.includes("[cover]")
}

/**
 * 从已保存的 YAML 中移除封面字段。
 *
 * 清空发布表单里的封面后，更新时不能让 mergeYamlObjs 把旧 cover 合并回来。
 * 解析失败时保持原样，避免破坏用户已保存的 YAML。
 *
 * @param yaml - 已保存的 YAML 内容
 * @param key - 封面字段名
 */
export const removeYamlCoverKey = (yaml: string | undefined, key: string): string => {
  const source = yaml ?? ""
  if (StrUtil.isEmptyString(source)) {
    return source
  }

  let yamlObj: Record<string, any>
  try {
    const parsed = YamlUtil.yaml2Obj(source)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return source
    }
    yamlObj = parsed as Record<string, any>
  } catch {
    return source
  }

  if (!Object.prototype.hasOwnProperty.call(yamlObj, key)) {
    return source
  }

  delete yamlObj[key]
  return YamlUtil.obj2Yaml(yamlObj)
}

/**
 * 是否是不需要上传的远程图片地址（http(s)、协议相对或 data URI）。
 *
 * @param value - 封面图地址
 */
export const isRemoteCoverUrl = (value: string): boolean => {
  return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(value) || /^data:/i.test(value)
}

/**
 * 是否是思源资源路径（assets/...），发布时需要先上传到平台图片仓库。
 *
 * @param value - 封面图地址
 */
export const isSiyuanAssetCover = (value: string): boolean => {
  return /^(?:\.{0,2}\/)?\/?assets\//i.test(value) || value.startsWith("siyuan://")
}

/**
 * 是否是已经可用的站内路径（/images/...、../images/...）。
 *
 * @param value - 封面图地址
 */
export const isPlatformCoverPath = (value: string): boolean => {
  if (isRemoteCoverUrl(value) || isSiyuanAssetCover(value)) {
    return false
  }
  return value.startsWith("/") || value.startsWith("../") || value.startsWith("./")
}

/**
 * 封面图是否需要在发布时上传到平台图片仓库。
 *
 * 远程地址与站内路径直接使用；思源资源相对路径需要上传。
 *
 * @param value - 封面图地址
 */
export const needsCoverUpload = (value: string): boolean => {
  return !isRemoteCoverUrl(value) && !isPlatformCoverPath(value)
}
