/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2025 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */

import { DynamicConfig, PlatformType } from "~/src/platforms/dynamicConfig.ts"
import { useVueI18n } from "~/src/composables/useVueI18n.ts"
import { mainPre, pre } from "~/src/platforms/pre.ts"

/**
 * 通用平台定义。包含平台类型列表、getPlatformType函数和getPrePlatform函数的对象。
 * @since 0.9.0
 */
export const usePlatformDefine = () => {
  const { t } = useVueI18n()

  const platformTypeList = mainPre(t)

  const prePlatformList: DynamicConfig[] = [
    ...pre.commonCfg,
    ...pre.githubCfg,
    ...pre.gitlabCfg,
    ...pre.metaweblogCfg,
    ...pre.wordpressCfg,
    ...pre.customCfg,
    ...pre.fsCfg,
  ]

  /**
   * 根据键获取平台类型
   *
   * @param key - 平台类型的键
   */
  const getPlatformType = (key) => {
    return platformTypeList.find((platformType) => platformType.type === key)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatformList = (type: PlatformType): DynamicConfig[] => {
    return prePlatformList.filter((platform) => platform.platformType === type)
  }

  /**
   * 根据类型获取预定义平台
   */
  const getPrePlatform = (key: string): DynamicConfig => {
    return prePlatformList.find((platform) => platform.platformKey === key)
  }

  /**
   * 根据所有预定义平台 key 集合
   */
  const getPrePlatformKeys = (): string[] => {
    return prePlatformList.map((platform) => {
      return platform.platformKey
    })
  }

  /**
   * 获取所有平台
   *
   * @since 1.20.0
   */
  const getAllPrePlatformList = (): DynamicConfig[] => {
    return prePlatformList
  }

  return {
    getPrePlatformKeys,
    platformTypeList,
    getPlatformType,
    getAllPrePlatformList,
    getPrePlatformList,
    getPrePlatform,
  }
}
